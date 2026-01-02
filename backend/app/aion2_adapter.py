"""
AION2 External Source Adapter

Scrapes character data from aion2.plaync.com using Playwright.
Fetches all sections: profile, stats, equipment, titles, ranking, skills, pet/wings.
"""

import os
import re
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from .schemas import CharacterDTO

logger = logging.getLogger(__name__)


class AION2Config:
    """Configuration for AION2 adapter"""
    BASE_URL = "https://aion2.plaync.com/ko-kr"
    SEARCH_URL = f"{BASE_URL}/characters/index"
    
    # Server ID mapping
    SERVER_ID_MAP = {
        "Israphel": "2002",  # 이스라펠
        "Siel": "2001",      # 시엘  
        "이스라펠": "2002",
        "시엘": "2001",
    }
    
    TIMEOUT_MS = 30000
    USER_AGENT = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )


class AION2SourceAdapter:
    """
    Production adapter for aion2.plaync.com
    Uses Playwright for JavaScript-rendered content
    """
    
    def __init__(self):
        logger.info("✓ AION2SourceAdapter initialized")
    
    
    def get_character(self, server: str, name: str, known_class: str = None) -> CharacterDTO:
        """
        Fetch full character data from AION2.
        
        Args:
            server: Server name
            name: Character name
            known_class: Class name if already known (e.g. from ranking)
        """
        from playwright.sync_api import sync_playwright
        
        logger.info(f"→ AION2 Fetching: {server}:{name}")
        
        server_id = AION2Config.SERVER_ID_MAP.get(server, AION2Config.SERVER_ID_MAP.get("Israphel"))
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent=AION2Config.USER_AGENT)
            page = context.new_page()
            
            try:
                # Step 1: Search for character
                search_url = f"{AION2Config.BASE_URL}/characters/index?serverId={server_id}&characterName={name}"
                logger.info(f"→ Navigating to: {search_url}")
                
                page.goto(search_url, timeout=AION2Config.TIMEOUT_MS)
                page.wait_for_timeout(3000)  # Wait for dynamic content
                
                # Step 2: Find character in results and click
                character_link = page.locator(f".character-list__item:has-text('{name}')")
                
                if character_link.count() > 0:
                    # Get the href
                    href = character_link.first.locator("a").get_attribute("href")
                    if href:
                        detail_url = f"https://aion2.plaync.com{href}"
                        logger.info(f"→ Found character, navigating to: {detail_url}")
                        
                        page.goto(detail_url, timeout=AION2Config.TIMEOUT_MS)
                        page.wait_for_timeout(3000)
                        
                        # Parse all sections
                        return self._parse_character_page(page, server, name, known_class)
                
                # Alternative: Direct search result parsing
                logger.warning(f"Character link not found, trying direct parsing")
                return self._parse_character_page(page, server, name, known_class)
                
            except Exception as e:
                logger.error(f"✗ AION2 fetch error: {e}")
                raise
            finally:
                browser.close()
    
    def get_character_by_url(self, url: str, server: str = "Unknown", name: str = "Unknown") -> CharacterDTO:
        """
        Fetch character data from a direct URL.
        Used when we already have the character page URL.
        """
        from playwright.sync_api import sync_playwright
        
        logger.info(f"→ AION2 Direct URL: {url}")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent=AION2Config.USER_AGENT)
            page = context.new_page()
            
            try:
                page.goto(url, timeout=AION2Config.TIMEOUT_MS)
                page.wait_for_timeout(3000)
                
                return self._parse_character_page(page, server, name)
                
            except Exception as e:
                logger.error(f"✗ AION2 direct fetch error: {e}")
                raise
            finally:
                browser.close()
    
    
    def _parse_character_page(self, page, server: str, name: str, known_class: str = None) -> CharacterDTO:
        """
        Parse all sections from the character detail page.
        """
        try:
            # 1. Profile Section
            profile = self._parse_profile(page)
            
            # Use known class if profile didn't find it
            final_class = profile.get("class_name")
            if not final_class or final_class == "Unknown":
                final_class = known_class or "Unknown"

            # 2. Stats Section (click '더보기' to expand)
            self._expand_stats(page)
            stats = self._parse_stats(page)
            
            # 3. Equipment Section
            equipment = self._parse_equipment(page)
            
            # 4. Pet/Wings (switch tab if needed)
            pet_wings = self._parse_pet_wings(page)
            
            # 5. Titles Section
            titles = self._parse_titles(page)
            
            # 6. Ranking Section
            ranking = self._parse_ranking(page)
            
            # 7. Skills Section
            skills = self._parse_skills(page)
            
            # 8. Stigma Section
            stigma = self._parse_stigma(page)
            
            # 9. Devanion Section
            devanion = self._parse_devanion(page)
            
            # 10. Arcana Section
            arcana = self._parse_arcana(page)
            
            # Build DTO
            dto = CharacterDTO(
                server=profile.get("server", server),
                name=profile.get("name", name),
                class_name=final_class,
                level=profile.get("level", 1),
                power=profile.get("power", 0),
                updated_at=datetime.now(),
                character_image_url=profile.get("image_url"),
                race=profile.get("race"),
                legion=profile.get("legion"),
                stats_json=stats,
                stats_payload={"primary": stats.get("base", {}), "detailed": stats.get("detailed", {})},
                equipment_data=equipment,
                titles_data=titles,
                ranking_data=ranking,
                pet_wings_data=pet_wings,
                skills_data=skills,
                stigma_data=stigma,
                devanion_data=devanion,
                arcana_data=arcana
            )
            
            logger.info(f"✓ Successfully parsed: {dto.name} (Lv.{dto.level}, {dto.class_name})")
            return dto
            
        except Exception as e:
            logger.error(f"✗ Parse error: {e}")
            # Return minimal DTO
            return CharacterDTO(
                server=server,
                name=name,
                class_name=known_class or "Unknown",
                level=1,
                power=0,
                updated_at=datetime.now()
            )
    
    
    def _parse_profile(self, page) -> Dict[str, Any]:
        """Parse character profile section"""
        profile = {}
        
        try:
            # Name
            name_el = page.locator(".profile__info-name")
            if name_el.count() > 0:
                profile["name"] = name_el.first.inner_text().strip()
            
            # Level and Class
            level_el = page.locator(".profile__class-level")
            if level_el.count() > 0:
                text = level_el.first.inner_text().strip()
                
                # Case 1: "Lv.45 ClassName"
                match = re.search(r'Lv\.?(\d+)\s*(.+)', text, re.IGNORECASE)
                if match:
                    profile["level"] = int(match.group(1))
                    profile["class_name"] = match.group(2).strip()
                # Case 2: Just number "45"
                elif text.isdigit():
                    profile["level"] = int(text)
            
            # Server, Race, Legion from description
            desc_el = page.locator(".profile__info-desc")
            if desc_el.count() > 0:
                desc_text = desc_el.first.inner_text().strip()
                parts = desc_text.split()
                if len(parts) >= 1:
                    profile["server"] = parts[0]
                if len(parts) >= 2:
                    profile["race"] = parts[1]  # 천족/마족
                if len(parts) >= 3:
                    profile["legion"] = " ".join(parts[2:])
            
            # Power (전투력)
            power_el = page.locator(".profile__info-item-level")
            if power_el.count() > 0:
                power_text = power_el.first.inner_text().strip().replace(",", "")
                match = re.search(r'(\d+)', power_text)
                if match:
                    profile["power"] = int(match.group(1))
            
            # Profile Image
            img_el = page.locator(".profile__avatar img")
            if img_el.count() > 0:
                profile["image_url"] = img_el.first.get_attribute("src")
                
        except Exception as e:
            logger.warning(f"Profile parse error: {e}")
        
        return profile
    
    def _expand_stats(self, page):
        """Click '더보기' button to expand stats"""
        try:
            more_btn = page.locator(".stat__btn-more")
            if more_btn.count() > 0:
                more_btn.first.click()
                page.wait_for_timeout(500)
        except Exception as e:
            logger.warning(f"Stats expand error: {e}")
    
    def _parse_stats(self, page) -> Dict[str, Any]:
        """Parse stats section"""
        stats = {"base": {}, "detailed": {}}
        
        try:
            # Base stats (위력, 민첩, 정확, 의지, 지식, 체력)
            base_items = page.locator(".stat__base-item")
            for i in range(base_items.count()):
                item = base_items.nth(i)
                text = item.inner_text().strip()
                lines = text.split("\n")
                if len(lines) >= 2:
                    stat_name = lines[0].strip()
                    stat_value = lines[1].strip().replace(",", "")
                    if stat_value.isdigit():
                        stats["base"][stat_name] = int(stat_value)
            
            # Detailed stats (from '더보기')
            detail_items = page.locator(".stat__detail-item, .stat-lords__item")
            for i in range(detail_items.count()):
                item = detail_items.nth(i)
                text = item.inner_text().strip()
                lines = text.split("\n")
                if len(lines) >= 2:
                    stat_name = lines[0].strip()
                    stat_value = lines[1].strip().replace(",", "")
                    if stat_value.replace("-", "").isdigit():
                        stats["detailed"][stat_name] = int(stat_value)
                        
        except Exception as e:
            logger.warning(f"Stats parse error: {e}")
        
        return stats
    
    def _parse_equipment(self, page) -> List[Dict[str, Any]]:
        """Parse equipment section"""
        equipment = []
        
        try:
            items = page.locator(".equipment__item")
            for i in range(items.count()):
                item = items.nth(i)
                
                equip_data = {}
                
                # Item name
                name_el = item.locator(".equipment__item-name, .item-name")
                if name_el.count() > 0:
                    equip_data["name"] = name_el.first.inner_text().strip()
                
                # Enhancement level
                enhance_el = item.locator(".equipment__item-enhance, .enhance")
                if enhance_el.count() > 0:
                    enhance_text = enhance_el.first.inner_text().strip()
                    match = re.search(r'\+(\d+)', enhance_text)
                    if match:
                        equip_data["enhancement"] = int(match.group(1))
                
                # Slot type
                slot_el = item.locator(".equipment__item-slot, .slot")
                if slot_el.count() > 0:
                    equip_data["slot"] = slot_el.first.inner_text().strip()
                
                if equip_data:
                    equipment.append(equip_data)
                    
        except Exception as e:
            logger.warning(f"Equipment parse error: {e}")
        
        return equipment
    
    def _parse_pet_wings(self, page) -> List[Dict[str, Any]]:
        """Parse pet and wings section"""
        pet_wings = []
        
        try:
            # Try to switch to pet/wings tab if exists
            pet_tab = page.locator(".equipment__tab-item:has-text('펫'), .equipment__tab-item:has-text('날개')")
            if pet_tab.count() > 0:
                pet_tab.first.click()
                page.wait_for_timeout(500)
            
            # Parse items
            items = page.locator(".pet__item, .wings__item, .equipment__item")
            for i in range(min(items.count(), 10)):  # Limit to 10 items
                item = items.nth(i)
                text = item.inner_text().strip()
                if text:
                    pet_wings.append({"name": text.split("\n")[0]})
                    
        except Exception as e:
            logger.warning(f"Pet/Wings parse error: {e}")
        
        return pet_wings
    
    def _parse_titles(self, page) -> List[Dict[str, Any]]:
        """Parse titles section"""
        titles = []
        
        try:
            section = page.locator(".title.info__section, [class*='title']")
            if section.count() > 0:
                # Get title count
                count_el = section.first.locator(".info__section-count, .title-count")
                if count_el.count() > 0:
                    titles.append({"count": count_el.first.inner_text().strip()})
                
                # Get active titles
                title_items = section.first.locator(".title__item, .title-item")
                for i in range(min(title_items.count(), 20)):
                    item = title_items.nth(i)
                    text = item.inner_text().strip()
                    if text:
                        titles.append({"name": text})
                        
        except Exception as e:
            logger.warning(f"Titles parse error: {e}")
        
        return titles
    
    def _parse_ranking(self, page) -> List[Dict[str, Any]]:
        """Parse ranking section"""
        ranking = []
        
        try:
            items = page.locator(".ranking__item")
            for i in range(items.count()):
                item = items.nth(i)
                
                rank_data = {}
                
                # Ranking type (어비스, 악몽, etc.)
                name_el = item.locator(".ranking__item-name")
                if name_el.count() > 0:
                    rank_data["type"] = name_el.first.inner_text().strip()
                
                # Rank position
                rank_el = item.locator(".ranking__item-rank")
                if rank_el.count() > 0:
                    rank_text = rank_el.first.inner_text().strip()
                    match = re.search(r'(\d+)', rank_text)
                    if match:
                        rank_data["rank"] = int(match.group(1))
                
                # Points
                point_el = item.locator(".ranking__item-point")
                if point_el.count() > 0:
                    point_text = point_el.first.inner_text().strip().replace(",", "")
                    if point_text.isdigit():
                        rank_data["points"] = int(point_text)
                
                if rank_data:
                    ranking.append(rank_data)
                    
        except Exception as e:
            logger.warning(f"Ranking parse error: {e}")
        
        return ranking
    
    def _parse_skills(self, page) -> List[Dict[str, Any]]:
        """Parse skills section"""
        skills = []
        
        try:
            items = page.locator(".skill__item, .skill-item")
            for i in range(min(items.count(), 50)):  # Limit
                item = items.nth(i)
                
                skill_data = {}
                
                # Skill icon/image
                img_el = item.locator("img")
                if img_el.count() > 0:
                    skill_data["icon"] = img_el.first.get_attribute("src")
                
                # Skill level
                level_el = item.locator(".skill__level, .level")
                if level_el.count() > 0:
                    level_text = level_el.first.inner_text().strip()
                    match = re.search(r'(\d+)', level_text)
                    if match:
                        skill_data["level"] = int(match.group(1))
                
                if skill_data:
                    skills.append(skill_data)
                    
        except Exception as e:
            logger.warning(f"Skills parse error: {e}")
        
        return skills
    
    def _parse_stigma(self, page) -> List[Dict[str, Any]]:
        """Parse stigma section"""
        stigma = []
        
        try:
            items = page.locator(".stigma__item, .stigma-item")
            for i in range(items.count()):
                item = items.nth(i)
                text = item.inner_text().strip()
                if text:
                    stigma.append({"name": text.split("\n")[0]})
                    
        except Exception as e:
            logger.warning(f"Stigma parse error: {e}")
        
        return stigma
    
    def _parse_devanion(self, page) -> Dict[str, Any]:
        """Parse devanion section"""
        devanion = {}
        
        try:
            items = page.locator(".deva__item, .devanion-item")
            for i in range(items.count()):
                item = items.nth(i)
                text = item.inner_text().strip()
                lines = text.split("\n")
                if len(lines) >= 2:
                    god_name = lines[0].strip()
                    value = lines[1].strip()
                    devanion[god_name] = value
                    
        except Exception as e:
            logger.warning(f"Devanion parse error: {e}")
        
        return devanion
    
    def _parse_arcana(self, page) -> List[Dict[str, Any]]:
        """Parse arcana section"""
        arcana = []
        
        try:
            items = page.locator(".arcana__item, .arcana-item")
            for i in range(items.count()):
                item = items.nth(i)
                text = item.inner_text().strip()
                if text:
                    arcana.append({"name": text.split("\n")[0]})
                    
        except Exception as e:
            logger.warning(f"Arcana parse error: {e}")
        
        return arcana
    
    
    def fetch_abyss_rankings(self, server: str, race: str, limit: int = 5) -> List[CharacterDTO]:
        """
        Fetch top N characters from Abyss Ranking and get their full details.
        
        Args:
            server: Server name (e.g., "이스라펠")
            race: Race name ("천족" or "마족")
            limit: Number of characters to fetch (default 5)
        """
        from playwright.sync_api import sync_playwright
        
        logger.info(f"→ Fetching Abyss Rankings: {server} / {race} (Top {limit})")
        
        # 1. Scrape the list of names first
        extracted_targets = []
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent=AION2Config.USER_AGENT)
            page = context.new_page()
            
            try:
                # Navigate to ranking page
                url = f"{AION2Config.BASE_URL}/ranking/abyss"
                page.goto(url, timeout=AION2Config.TIMEOUT_MS)
                page.wait_for_selector(".ranking-table__body-items", timeout=10000)
                
                # Open server/race dropdown
                trigger = page.locator(".dropdown-menu__trigger").first
                if trigger.is_visible():
                    trigger.click()
                    page.wait_for_timeout(500)
                    
                    # 1. Select Race
                    race_el = page.locator(f".dropdown-menu__item--first:has-text('{race}')")
                    if race_el.count() > 0:
                        race_el.first.click()
                        page.wait_for_timeout(500)
                    
                    # 2. Select Server
                    server_el = page.locator(f".dropdown-menu__item--second:has-text('{server}')")
                    if server_el.count() > 0:
                        server_el.first.click()
                        page.wait_for_timeout(2000) 
                
                # Check rows
                rows = page.locator(".ranking-table__body-items")
                count = min(rows.count(), limit)
                
                logger.info(f"Found {rows.count()} ranking rows, processing top {count}")
                
                for i in range(count):
                    row = rows.nth(i)
                    
                    # Name
                    name_el = row.locator(".ranking-table__name-character")
                    char_name = name_el.inner_text().strip() if name_el.count() > 0 else ""
                    
                    # Class extraction (Assuming 3rd column div)
                    class_name = "Unknown"
                    items = row.locator(".ranking-table__body-item")
                    # Index 0: Rank, 1: Name, 2: Class, 3: Points
                    if items.count() >= 3:
                        class_text = items.nth(2).inner_text().strip()
                        if class_text:
                            class_name = class_text
                    
                    if char_name:
                        extracted_targets.append({"name": char_name, "class": class_name})
                            
            except Exception as e:
                logger.error(f"Ranking list fetch error: {e}")
                
            finally:
                browser.close()
        
        # 2. Fetch details for each character
        results = []
        for target in extracted_targets:
            try:
                name = target["name"]
                cls = target["class"]
                logger.info(f"Fetching details for ranker: {name} (Class: {cls})")
                
                # Use existing robust get_character method with known_class
                dto = self.get_character(server, name, known_class=cls)
                results.append(dto)
            except Exception as e:
                logger.error(f"Failed to fetch detailed info for {target.get('name')}: {e}")
                
        return results


# Factory function
def get_aion2_adapter() -> AION2SourceAdapter:
    """Get AION2 source adapter instance"""
    return AION2SourceAdapter()
