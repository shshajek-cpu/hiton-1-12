
import math

# 1. Provide Constants
SCALE = 1.0 # Will tune this later
A_EXP = 1.0 # Simple multiplication for now, or tuned
B_EXP = 1.0
C_EXP = 1.0
DEF_K = 3500 # Defense constant

# Softcap function (Saturation)
def softcap(x, cap, k):
    # x: input value (e.g., 0.45 for 45%)
    # cap: max limit asymptote (e.g., 1.0 for 100%)
    # k: steepness factor
    if x <= 0: return 0
    # Formula: cap * x / (x + k) -> this approaches cap as x -> infinity
    # But user asked for: (cap * x) / (x + k)
    return (cap * x) / (x + k)

def calculate_score(name, stats, tune_scale=None):
    # Stats Unpacking
    atk = stats['atk']
    dmg_inc = stats['dmg_inc'] # % as float (0.25)
    atk_speed = stats['atk_speed'] # % as float
    crit_rate = stats['crit_rate'] # % as float
    crit_dmg = stats['crit_dmg'] # % as float
    multi_hit = stats['multi_hit'] # % as float
    hp = stats['hp']
    defense = stats['defense']
    
    # --- 2. OFFENSE ---
    # Softcaps for efficiency
    # Assume 1% atk speed isn't linear forever. Cap at 100% efficiency? 
    # Let's use simpler linear for now inside the "efficacy" but user asked for softcap.
    # We will softcap the *effectiveness* of Atk Speed and Crit Rate.
    
    # AS Efficiency: Softcap at 200% (2.0), k=1.0. 
    # If AS is 45% (0.45), result = 2.0 * 0.45 / (0.45 + 1.0) = 0.9 / 1.45 = 0.62... 
    # Wait, simple linear is 1+AS. Let's just apply softcap to the *input value* before adding 1?
    # No, user said "as_eff". Let's assume as_eff = softcap(atk_speed).
    
    as_eff = softcap(atk_speed, 2.0, 0.5) # Cap effective speed boost at 200%
    crit_rate_eff = softcap(crit_rate, 0.8, 0.3) # Cap crit rate at 80%
    
    # Multi-hit Formula (Fixed Rule)
    # Final Prob = 0.19 + multi_hit_stat
    # If stat >= 0.81, prob = 1.0
    
    mh_prob = 0.19 + multi_hit
    if multi_hit >= 0.81:
        mh_prob = 1.0
    elif mh_prob > 1.0:
        mh_prob = 1.0
        
    # Expectation: 1 + p * 0.206
    m_multihit = 1 + (mh_prob * 0.206)
    
    # Offense Score
    # OFFENSE = ATK * (1 + Dmg) * (1 + AS) * (1 + CR*CD) * Multi
    offense = atk * (1 + dmg_inc) * (1 + as_eff) * (1 + crit_rate_eff * crit_dmg) * m_multihit
    
    # --- 3. DEFENSE ---
    # DR = 1 - 1 / (1 + def/K)
    dr = 1 - (1 / (1 + defense / DEF_K))
    ehp = hp / (1 - dr) # = hp * (1 + def/K) basically
    
    defense_score = ehp # Simplified EHP based score
    
    # --- 4. UTILITY ---
    # Placeholder for now, assume 1.05 baseline
    utility_score = 1.0 
    
    # --- TOTAL ---
    # SCORE = SCALE * (OFFENSE^a * DEFENSE^b * UTILITY^c)
    # Let's try to balance a and b.
    # Logically, Damage * Toughness = Combat Capability.
    # So a=0.5, b=0.5 (Geometric Mean) is mathematically sound for "Duel Power".
    # User asked for a,b,c tuning.
    a = 0.55
    b = 0.45
    c = 0.1
    pve_mod = 1.0
    
    # Pre-scale calculation
    raw_score = (offense ** a) * (defense_score ** b) * (utility_score ** c) * pve_mod
    
    if tune_scale:
        # We want final score to be 'tune_scale' (target score)
        # SCALE * raw = target -> SCALE = target / raw
        needed_scale = tune_scale / raw_score
        return needed_scale, raw_score, offense, defense_score
        
    final_score = SCALE * raw_score
    return final_score, offense, defense_score, ehp, m_multihit

# Define Characters
char_a = {
    'atk': 2200, 'dmg_inc': 0.25, 'atk_speed': 0.45, 
    'crit_rate': 0.35, 'crit_dmg': 0.60, 'multi_hit': 0.60,
    'hp': 18000, 'defense': 1400
}

char_b = {
    'atk': 1700, 'dmg_inc': 0.15, 'atk_speed': 0.20,
    'crit_rate': 0.20, 'crit_dmg': 0.40, 'multi_hit': 0.15,
    'hp': 14000, 'defense': 900
}

# Ranker "Ah-E-I-O-U" (from scraping)
# ATK: 3610
# HP: 6550
# DEF: 9260 (This is huge compared to Char A, maybe different scale? Or standard?)
#   Note: Char A has 1400 Def, Ranker has 9260. Ranker is "Lv 45".
#   Maybe Char A is low level? Or maybe Ranker Def is calculated differently?
#   Let's trust the scraped numbers.
# Crit: 302 -> Is this flat? If existing game uses ~1000 scale, 302 is ~30%?
#   Let's guess 30% (0.302) for now.
# Atk Spd: 36.6 -> 36.6%? (0.366)
# Multi-hit: 20.8 -> 20.8%? (0.208)
# Dmg Inc: 24 -> 24%? (0.24)
ranker = {
    'atk': 3610, 'dmg_inc': 0.24, 'atk_speed': 0.366,
    'crit_rate': 0.302, 'crit_dmg': 0.50, # Guessing 50% base if not shown
    'multi_hit': 0.208,
    'hp': 6550, 'defense': 9260
}

# 1. Tune Scale based on Ranker's real score (47322)
target_score = 47322
calculated_scale, raw_r, off_r, def_r = calculate_score("Ranker", ranker, tune_scale=target_score)
SCALE = calculated_scale

# 2. Calculate A and B
score_a, off_a, def_a, ehp_a, multi_a = calculate_score("Char A", char_a)
score_b, off_b, def_b, ehp_b, multi_b = calculate_score("Char B", char_b)

print(f"--- Tuning Results ---")
print(f"Target Score: {target_score}")
print(f"Derived SCALE: {SCALE:.4f}")
print(f"Ranker Stats -> Offense: {off_r:.2f}, Defense: {def_r:.2f}")
print(f"----------------------")

print(f"--- Character A (High Spec) ---")
print(f"Score: {score_a:.2f}")
print(f"Offense Component: {off_a:.2f}")
print(f"Defense Component (EHP): {def_a:.2f}")
print(f"Multi-Hit Multiplier: {multi_a:.4f}")
print(f"EHP: {ehp_a:.2f}")

print(f"--- Character B (Mid Spec) ---")
print(f"Score: {score_b:.2f}")
print(f"Offense Component: {off_b:.2f}")
print(f"Defense Component (EHP): {def_b:.2f}")
print(f"Multi-Hit Multiplier: {multi_b:.4f}")
print(f"EHP: {ehp_b:.2f}")
