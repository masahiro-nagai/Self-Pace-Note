# Own Pace Loop Architecture

`beginner-loop.html` は静的ファイルだけで動く MVP です。  
そのうえで、Google Cloud のクレジットを活かして段階的に伸ばせるように、Cloud Run と Vertex AI を差し込める前提で設計しています。

アプリ名は `Own Pace Loop` を想定しています。  
GitHub のリポジトリ名は `own-pace-loop` が素直です。

このアプリの中心思想は次の 3 つです。

- 他人との比較ではなく、自分との比較をする
- 前進だけでなく、後退や調整も必要な選択として扱う
- 自認と肯定を続けながら、積み重ねていく

## まずの方針

- 最初は `localStorage` だけでプロダクトの感触を確かめる
- AI が効く場所だけを API 化する
- いきなり全部クラウドに寄せず、価値が見えた箇所から課金を使う
- 他人比較を煽る機能は作らず、自分比のふり返りを中心に置く

## おすすめ構成

### 1. Frontend

- いまは静的 HTML / CSS / JS
- 将来は次のどちらかへ載せ替えやすい
  - Cloud Storage + CDN
  - Firebase Hosting

### 2. Cloud Run

Cloud Run はこのアプリの API 層として使います。

想定エンドポイント:

- `POST /api/challenge`
  - 入力: テーマ、場面、強度、選んだカテゴリ、最近のログ
  - 出力: 今日の一歩 1 件
- `POST /api/weekly-review`
  - 入力: 直近 7 日のログ
  - 出力: 週次レビュー文

Cloud Run に載せる責務:

- Vertex AI / Gemini 呼び出し
- Firestore への保存
- CORS と認証の入口
- 将来の課金や使用量制御

## Vertex AI / Gemini の役割

Gemini は、汎用チャレンジ生成ではなく、次の 2 点に絞ると費用対効果が高いです。

- 文脈に合った今日の一歩の提案
- 蓄積ログからの週次レビュー要約

プロンプトで守るべき制約:

- 他人との優劣比較を煽らない
- 自己否定を強める提案をしない
- 危険行為、対人トラブル、過剰な公開羞恥を促さない
- 「結果」ではなく「実行回数」を評価軸にする
- 後退や休息を失敗として扱わない
- 恥ずかしさは基本 3〜6 / 10 を中心にする

## Firestore の役割

保存対象の最小単位:

- `users/{userId}`
  - `focusArea`
  - `defaultIntensity`
  - `selectedCategories`
- `users/{userId}/dailyLogs/{date}`
  - `status` (`done`, `grounded`, `retreated` など)
  - `fearBefore`
  - `reliefAfter` (`自己信頼` として表示)
  - `actionTaken`
  - `actualOutcome`
  - `learning` (`前の自分との違い`)
  - `challengeSnapshot`

Firestore が向いている理由:

- 日次ログの読み書きが素直
- ユーザー単位のデータ構造と相性がいい
- 小規模 MVP で扱いやすい

## BigQuery の役割

BigQuery は最初から必須ではありません。  
ただし、継続率やチャレンジタイプの分析を始める段階で効きます。

入れると見えるもの:

- どのカテゴリが自分に合った継続につながるか
- 恥ずかしさの強度と実行率の関係
- 週次レビュー後に自己信頼がどう変わるか
- 初回 7 日の定着率

## このフロントが期待する API 仕様

### `POST /api/challenge`

リクエスト例:

```json
{
  "date": "2026-04-17",
  "focusArea": "発信",
  "socialContext": "X での投稿",
  "intensity": 3,
  "categories": ["draft", "public"],
  "recentLogs": [
    {
      "date": "2026-04-16",
      "status": "done",
      "category": "draft",
      "challengeTitle": "60点のドラフトを先に見せる",
      "learning": "思ったより普通だった"
    }
  ]
}
```

レスポンス例:

```json
{
  "id": "challenge-20260417-01",
  "date": "2026-04-17",
  "category": "public",
  "title": "下手でも1本投稿する",
  "text": "今日は完成度よりも公開を優先し、途中の考えを短く1本出す。",
  "steps": [
    "テーマを一文で決める",
    "60秒で下書きを作る",
    "整えすぎずに投稿する"
  ],
  "purpose": "人前で初心者になる耐性を育てる",
  "shame": 5,
  "win": "投稿できたら達成"
}
```

### `POST /api/weekly-review`

リクエスト例:

```json
{
  "date": "2026-04-17",
  "logs": [
    {
      "date": "2026-04-16",
      "status": "done",
      "fearBefore": 6,
      "reliefAfter": 8,
      "actionTaken": "途中の投稿案を共有した",
      "actualOutcome": "意外と好意的だった",
      "learning": "未完成でも前に進む",
      "category": "draft",
      "challengeTitle": "60点のドラフトを先に見せる"
    }
  ]
}
```

レスポンス例:

```json
{
  "paragraphs": [
    "今週は3回、自分に合う一歩を実行できています。",
    "特に未完成を見せる型が機能していて、実行後の解放感が高めです。",
    "次週は恥ずかしさを少しだけ上げて、人前で初心者になる型を1回混ぜるのがよさそうです。"
  ]
}
```

## 進め方のおすすめ

1. この静的 MVP をまず自分で 1 週間使う
2. 残したくなるログ項目だけに絞る
3. `POST /api/challenge` だけ Cloud Run で先に作る
4. 使う価値が見えたら Firestore 保存を入れる
5. ユーザーが増えたら BigQuery で自分比の継続分析を始める

## 実装メモ

- フロントの `Cloud Run API URL` 入力欄にベース URL を入れると API 呼び出しを試します
- 失敗時はローカル生成に自動フォールバックします
- このため、バックエンドが未完成でもフロント開発を止めずに進められます
