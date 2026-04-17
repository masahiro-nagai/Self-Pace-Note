# DESIGN.md

このファイルはAntigravity（生成AIエージェント）向けのデザイン設計基準です。
「センス」など曖昧な概念ではなく、数値で定義された「科学」としてデザインルールを明記し、一貫したプロ品質のUI出力を保証するための規約です。

## 科学的背景（Antigravityが準拠すべき原則）
- **Fittsの法則**: ターゲットが大きく・近いほどクリック/タップしやすい。ボタン等のインタラクティブ要素は適切なサイズ（最小48pxを推奨）を確保すること。
- **ゲシュタルトの法則（近接）**: 関連する要素は近づけ、異なるグループ間には明確な余白を設けること。
- **F字視線パターン**: 画面の左上→右→左下の視線移動を考慮し、重要情報を配置すること。
- **コントラスト比 4.5:1**: テキストと背景のコントラスト比はWCAG AA基準（4.5:1以上）を必ずクリアすること。

---

## 1. Color Palette & Roles（色と役割）
- Primary:    #1A73E8 （メインCTA・主要リンク等）
- Background: #FFFFFF （全般の背景）
- Surface:    #F8F9FA （カード・セクションの背景）
- Text:       #202124 （見出しおよび本文）
- Accent:     #EA4335 （警告・強調・エラーなどの差し色）

## 2. Typography Rules（フォントと文字サイズ）
- Font:       Noto Sans JP, Inter, sans-serif
- Base size:  16px
- Line height: 1.75
- Heading:    Bold
  - H1 = 32px
  - H2 = 24px
  - H3 = 20px

## 3. Component Stylings（コンポーネントスタイル）
- Button:     角丸8px、padding 12px 24px、最小横幅 120px、最小高さ 48px
- Card:       角丸12px、border 1px solid #E8EAED、shadow 0 2px 8px rgba(0,0,0,0.08)
- Input:      border 1px solid #DADCE0、角丸4px、padding 12px、最小高さ 48px

## 4. Layout Principles（配置と余白）
- Container:  最大横幅 1200px、両サイドの余白24px以上
- Spacing:    8pxの倍数（8, 16, 24, 32, 48, 64, 80px）を原則とする
- Section:    セクション間の余白は 80px を基本とする

## 5. Agent Prompt Guide（Antigravityへの指示ルール）
UI・フロントエンド実装を行う際は、必ずこの `DESIGN.md` の数値・指定を最優先して遵守すること。
「モダンな感じ」「おしゃれに」といった曖昧な解釈はせず、指定されたカラーコード、ピクセル数、フォント設定を厳格に反映してください。
