'use client';

import React, { useState } from 'react';
import { Button, Card, Badge, Input, Container, Grid, SearchInput, SearchBar } from '@/components/ui';
import type { SearchSuggestion } from '@/components/ui';
import { theme } from '@/lib/theme';

export default function ComponentsDemo() {
  const [inputValue, setInputValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showError, setShowError] = useState(false);

  // Search states
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'Siel서버', type: 'trending', metadata: '인기 검색어' },
    { id: '2', text: 'TestChar123', type: 'suggestion', metadata: '캐릭터' },
    { id: '3', text: 'Israphel서버', type: 'trending', metadata: '인기 검색어' },
    { id: '4', text: 'PlayerName', type: 'suggestion', metadata: '캐릭터' },
  ];

  const handleSearch = (value: string) => {
    console.log('Searching for:', value);
    setSearchLoading(true);
    setTimeout(() => {
      setSearchResults([value]);
      setSearchLoading(false);
    }, 1000);
  };

  return (
    <div className="page">
      <Container maxWidth="xl">
        <header className="header">
          <h1 className="title">UI 컴포넌트 라이브러리</h1>
          <p className="subtitle">
            dak.gg 테마를 기반으로 한 재사용 가능한 컴포넌트 시스템
          </p>
        </header>

        {/* Color Palette */}
        <section className="section">
          <h2 className="section-title">Color Palette</h2>
          <div className="color-grid">
            <div className="color-section">
              <h3 className="color-section-title">Brand Colors</h3>
              <div className="color-items">
                <div className="color-item">
                  <div className="color-box" style={{ backgroundColor: theme.colors.brand.primary }} />
                  <div className="color-info">
                    <div className="color-name">Primary</div>
                    <div className="color-value">{theme.colors.brand.primary}</div>
                  </div>
                </div>
                <div className="color-item">
                  <div className="color-box" style={{ backgroundColor: theme.colors.brand.secondary }} />
                  <div className="color-info">
                    <div className="color-name">Secondary</div>
                    <div className="color-value">{theme.colors.brand.secondary}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="color-section">
              <h3 className="color-section-title">Background Colors</h3>
              <div className="color-items">
                <div className="color-item">
                  <div className="color-box" style={{ backgroundColor: theme.colors.background.primary }} />
                  <div className="color-info">
                    <div className="color-name">Primary</div>
                    <div className="color-value">{theme.colors.background.primary}</div>
                  </div>
                </div>
                <div className="color-item">
                  <div className="color-box" style={{ backgroundColor: theme.colors.background.secondary }} />
                  <div className="color-info">
                    <div className="color-name">Secondary</div>
                    <div className="color-value">{theme.colors.background.secondary}</div>
                  </div>
                </div>
                <div className="color-item">
                  <div className="color-box" style={{ backgroundColor: theme.colors.background.tertiary }} />
                  <div className="color-info">
                    <div className="color-name">Tertiary</div>
                    <div className="color-value">{theme.colors.background.tertiary}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="color-section">
              <h3 className="color-section-title">State Colors</h3>
              <div className="color-items">
                <div className="color-item">
                  <div className="color-box" style={{ backgroundColor: theme.colors.state.success }} />
                  <div className="color-info">
                    <div className="color-name">Success</div>
                    <div className="color-value">{theme.colors.state.success}</div>
                  </div>
                </div>
                <div className="color-item">
                  <div className="color-box" style={{ backgroundColor: theme.colors.state.error }} />
                  <div className="color-info">
                    <div className="color-name">Error</div>
                    <div className="color-value">{theme.colors.state.error}</div>
                  </div>
                </div>
                <div className="color-item">
                  <div className="color-box" style={{ backgroundColor: theme.colors.state.warning }} />
                  <div className="color-info">
                    <div className="color-name">Warning</div>
                    <div className="color-value">{theme.colors.state.warning}</div>
                  </div>
                </div>
                <div className="color-item">
                  <div className="color-box" style={{ backgroundColor: theme.colors.state.info }} />
                  <div className="color-info">
                    <div className="color-name">Info</div>
                    <div className="color-value">{theme.colors.state.info}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="section">
          <h2 className="section-title">Buttons</h2>

          <div className="demo-group">
            <h3 className="demo-group-title">Variants</h3>
            <div className="button-grid">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="danger">Danger Button</Button>
            </div>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Sizes</h3>
            <div className="button-grid">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Filter Buttons (Interactive)</h3>
            <div className="button-grid">
              <Button
                variant="filter"
                active={activeFilter === 'all'}
                onClick={() => setActiveFilter('all')}
              >
                전체
              </Button>
              <Button
                variant="filter"
                active={activeFilter === 'lol'}
                onClick={() => setActiveFilter('lol')}
              >
                리그 오브 레전드
              </Button>
              <Button
                variant="filter"
                active={activeFilter === 'tft'}
                onClick={() => setActiveFilter('tft')}
              >
                전략적 팀 전투
              </Button>
              <Button
                variant="filter"
                active={activeFilter === 'valorant'}
                onClick={() => setActiveFilter('valorant')}
              >
                발로란트
              </Button>
            </div>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">States</h3>
            <div className="button-grid">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="section">
          <h2 className="section-title">Cards</h2>
          <Grid columns={3} gap="4">
            <Card variant="default">
              <h3 className="card-title">Default Card</h3>
              <p className="card-text">
                기본 카드 스타일입니다. 그림자 효과가 있습니다.
              </p>
            </Card>
            <Card variant="elevated">
              <h3 className="card-title">Elevated Card</h3>
              <p className="card-text">
                더 강한 그림자 효과가 있는 카드입니다.
              </p>
            </Card>
            <Card variant="flat">
              <h3 className="card-title">Flat Card</h3>
              <p className="card-text">
                그림자가 없는 평면 카드입니다.
              </p>
            </Card>
          </Grid>

          <div className="demo-group">
            <h3 className="demo-group-title">Hoverable Cards</h3>
            <Grid columns={2} gap="4">
              <Card variant="default" hoverable>
                <h3 className="card-title">Hover Me!</h3>
                <p className="card-text">
                  마우스를 올려보세요. 호버 효과가 있습니다.
                </p>
              </Card>
              <Card variant="elevated" onClick={() => alert('Card clicked!')}>
                <h3 className="card-title">Clickable Card</h3>
                <p className="card-text">
                  클릭할 수 있는 카드입니다. 호버 효과와 커서가 변경됩니다.
                </p>
              </Card>
            </Grid>
          </div>
        </section>

        {/* Badges */}
        <section className="section">
          <h2 className="section-title">Badges</h2>

          <div className="demo-group">
            <h3 className="demo-group-title">Variants</h3>
            <div className="badge-grid">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Sizes</h3>
            <div className="badge-grid">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Usage Example</h3>
            <Card variant="default">
              <div className="badge-card">
                <h3 className="card-title">
                  사용자 프로필 <Badge variant="success">인증됨</Badge>
                </h3>
                <p className="card-text">
                  최근 업데이트: <Badge variant="info">2시간 전</Badge>
                </p>
                <p className="card-text">
                  상태: <Badge variant="warning">대기 중</Badge>
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Inputs */}
        <section className="section">
          <h2 className="section-title">Inputs</h2>

          <div className="demo-group">
            <h3 className="demo-group-title">Basic Input</h3>
            <Input
              placeholder="텍스트를 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">With Label</h3>
            <Input
              label="사용자 이름"
              placeholder="닉네임을 입력하세요"
            />
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">With Helper Text</h3>
            <Input
              label="이메일"
              placeholder="example@email.com"
              helperText="이메일 주소를 정확히 입력해주세요"
            />
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">With Error (Interactive)</h3>
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              error={showError ? '비밀번호는 8자 이상이어야 합니다' : undefined}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowError(!showError)}
            >
              {showError ? 'Hide Error' : 'Show Error'}
            </Button>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Full Width</h3>
            <Input
              label="서버 선택"
              placeholder="서버 이름을 입력하세요"
              fullWidth
            />
          </div>
        </section>

        {/* Search Components */}
        <section className="section">
          <h2 className="section-title">Search Components</h2>

          <div className="demo-group">
            <h3 className="demo-group-title">Basic Search Input</h3>
            <SearchInput
              placeholder="캐릭터를 검색하세요..."
              onSearch={handleSearch}
            />
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Search with Loading State</h3>
            <SearchInput
              placeholder="검색..."
              loading={searchLoading}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
            />
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Search Sizes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
              <SearchInput size="sm" placeholder="Small search..." />
              <SearchInput size="md" placeholder="Medium search..." />
              <SearchInput size="lg" placeholder="Large search..." />
            </div>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Full Width Search</h3>
            <SearchInput
              placeholder="전체 너비 검색..."
              fullWidth
              onSearch={handleSearch}
            />
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Advanced Search Bar with Autocomplete</h3>
            <SearchBar
              placeholder="서버/캐릭터 이름을 검색하세요..."
              suggestions={mockSuggestions}
              onSearch={handleSearch}
              showRecentSearches
              fullWidth
            />
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Search Bar with Loading</h3>
            <SearchBar
              placeholder="검색 중..."
              suggestions={mockSuggestions}
              onSearch={handleSearch}
              loading={searchLoading}
              fullWidth
            />
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Search Results</h3>
            {searchResults.length > 0 && (
              <Card variant="elevated">
                <h4 className="card-title">검색 결과</h4>
                {searchResults.map((result, idx) => (
                  <p key={idx} className="card-text">"{result}" 검색 완료</p>
                ))}
              </Card>
            )}
          </div>
        </section>

        {/* Grid & Layout */}
        <section className="section">
          <h2 className="section-title">Grid & Layout</h2>

          <div className="demo-group">
            <h3 className="demo-group-title">2 Columns</h3>
            <Grid columns={2} gap="4">
              <Card variant="flat">
                <div className="grid-demo-card">1</div>
              </Card>
              <Card variant="flat">
                <div className="grid-demo-card">2</div>
              </Card>
            </Grid>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">3 Columns</h3>
            <Grid columns={3} gap="4">
              <Card variant="flat">
                <div className="grid-demo-card">1</div>
              </Card>
              <Card variant="flat">
                <div className="grid-demo-card">2</div>
              </Card>
              <Card variant="flat">
                <div className="grid-demo-card">3</div>
              </Card>
            </Grid>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">4 Columns</h3>
            <Grid columns={4} gap="4">
              <Card variant="flat">
                <div className="grid-demo-card">1</div>
              </Card>
              <Card variant="flat">
                <div className="grid-demo-card">2</div>
              </Card>
              <Card variant="flat">
                <div className="grid-demo-card">3</div>
              </Card>
              <Card variant="flat">
                <div className="grid-demo-card">4</div>
              </Card>
            </Grid>
          </div>

          <div className="demo-group">
            <h3 className="demo-group-title">Auto Fill</h3>
            <Grid columns="auto" gap="4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} variant="flat">
                  <div className="grid-demo-card">{i + 1}</div>
                </Card>
              ))}
            </Grid>
          </div>
        </section>

        {/* Real-world Example */}
        <section className="section">
          <h2 className="section-title">실전 예제</h2>
          <Card variant="elevated" padding="6">
            <div className="example-header">
              <h3 className="example-title">
                게임 카드 목록 <Badge variant="success">317,660개</Badge>
              </h3>
              <Button variant="primary">카드 만들기</Button>
            </div>

            <div className="filter-section">
              <Button variant="filter" active={true}>
                전체
              </Button>
              <Button variant="filter">리그 오브 레전드</Button>
              <Button variant="filter">전략적 팀 전투</Button>
              <Button variant="filter">발로란트</Button>
            </div>

            <Grid columns={3} gap="4">
              <Card variant="default" hoverable>
                <div className="game-card">
                  <div className="game-card-header">
                    <Badge variant="info">LOL</Badge>
                    <span className="game-card-time">2시간 전</span>
                  </div>
                  <h4 className="game-card-title">플레이어 1</h4>
                  <p className="game-card-stats">랭크: 다이아몬드 III</p>
                </div>
              </Card>
              <Card variant="default" hoverable>
                <div className="game-card">
                  <div className="game-card-header">
                    <Badge variant="warning">TFT</Badge>
                    <span className="game-card-time">3시간 전</span>
                  </div>
                  <h4 className="game-card-title">플레이어 2</h4>
                  <p className="game-card-stats">랭크: 마스터</p>
                </div>
              </Card>
              <Card variant="default" hoverable>
                <div className="game-card">
                  <div className="game-card-header">
                    <Badge variant="error">VAL</Badge>
                    <span className="game-card-time">5시간 전</span>
                  </div>
                  <h4 className="game-card-title">플레이어 3</h4>
                  <p className="game-card-stats">랭크: 불멸</p>
                </div>
              </Card>
            </Grid>
          </Card>
        </section>
      </Container>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background-color: ${theme.colors.background.primary};
          color: ${theme.colors.text.primary};
          padding: ${theme.spacing[10]} 0;
          font-family: ${theme.typography.fontFamily.primary};
        }

        .header {
          text-align: center;
          margin-bottom: ${theme.spacing[16]};
        }

        .title {
          font-size: ${theme.typography.fontSize['4xl']};
          font-weight: ${theme.typography.fontWeight.bold};
          margin-bottom: ${theme.spacing[4]};
          color: ${theme.colors.text.primary};
        }

        .subtitle {
          font-size: ${theme.typography.fontSize.lg};
          color: ${theme.colors.text.secondary};
        }

        .section {
          margin-bottom: ${theme.spacing[16]};
        }

        .section-title {
          font-size: ${theme.typography.fontSize['2xl']};
          font-weight: ${theme.typography.fontWeight.bold};
          margin-bottom: ${theme.spacing[6]};
          color: ${theme.colors.text.primary};
          padding-bottom: ${theme.spacing[3]};
          border-bottom: 2px solid ${theme.colors.brand.primary};
        }

        .demo-group {
          margin-bottom: ${theme.spacing[8]};
        }

        .demo-group-title {
          font-size: ${theme.typography.fontSize.lg};
          font-weight: ${theme.typography.fontWeight.semibold};
          margin-bottom: ${theme.spacing[4]};
          color: ${theme.colors.text.secondary};
        }

        .button-grid,
        .badge-grid {
          display: flex;
          flex-wrap: wrap;
          gap: ${theme.spacing[3]};
          align-items: center;
        }

        .card-title {
          font-size: ${theme.typography.fontSize.lg};
          font-weight: ${theme.typography.fontWeight.semibold};
          margin-bottom: ${theme.spacing[2]};
          color: ${theme.colors.text.primary};
        }

        .card-text {
          color: ${theme.colors.text.secondary};
          line-height: ${theme.typography.lineHeight.relaxed};
        }

        .badge-card {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing[2]};
        }

        .grid-demo-card {
          text-align: center;
          padding: ${theme.spacing[8]} 0;
          font-size: ${theme.typography.fontSize['2xl']};
          font-weight: ${theme.typography.fontWeight.bold};
          color: ${theme.colors.text.primary};
        }

        /* Color Palette */
        .color-grid {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing[8]};
        }

        .color-section {
          background-color: ${theme.colors.background.secondary};
          padding: ${theme.spacing[6]};
          border-radius: ${theme.borderRadius.lg};
        }

        .color-section-title {
          font-size: ${theme.typography.fontSize.lg};
          font-weight: ${theme.typography.fontWeight.semibold};
          margin-bottom: ${theme.spacing[4]};
          color: ${theme.colors.text.primary};
        }

        .color-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: ${theme.spacing[4]};
        }

        .color-item {
          display: flex;
          align-items: center;
          gap: ${theme.spacing[3]};
          padding: ${theme.spacing[3]};
          background-color: ${theme.colors.background.tertiary};
          border-radius: ${theme.borderRadius.md};
        }

        .color-box {
          width: 48px;
          height: 48px;
          border-radius: ${theme.borderRadius.md};
          border: 1px solid ${theme.colors.border.light};
        }

        .color-info {
          flex: 1;
        }

        .color-name {
          font-size: ${theme.typography.fontSize.sm};
          font-weight: ${theme.typography.fontWeight.medium};
          color: ${theme.colors.text.primary};
          margin-bottom: ${theme.spacing[1]};
        }

        .color-value {
          font-size: ${theme.typography.fontSize.xs};
          font-family: ${theme.typography.fontFamily.mono};
          color: ${theme.colors.text.muted};
        }

        /* Real-world Example */
        .example-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing[6]};
        }

        .example-title {
          font-size: ${theme.typography.fontSize['2xl']};
          font-weight: ${theme.typography.fontWeight.bold};
          display: flex;
          align-items: center;
          gap: ${theme.spacing[3]};
        }

        .filter-section {
          display: flex;
          gap: ${theme.spacing[2]};
          margin-bottom: ${theme.spacing[6]};
          flex-wrap: wrap;
        }

        .game-card {
          padding: ${theme.spacing[2]};
        }

        .game-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing[3]};
        }

        .game-card-time {
          font-size: ${theme.typography.fontSize.xs};
          color: ${theme.colors.text.muted};
        }

        .game-card-title {
          font-size: ${theme.typography.fontSize.lg};
          font-weight: ${theme.typography.fontWeight.semibold};
          margin-bottom: ${theme.spacing[2]};
          color: ${theme.colors.text.primary};
        }

        .game-card-stats {
          font-size: ${theme.typography.fontSize.sm};
          color: ${theme.colors.text.secondary};
        }

        @media (max-width: 768px) {
          .example-header {
            flex-direction: column;
            gap: ${theme.spacing[4]};
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
