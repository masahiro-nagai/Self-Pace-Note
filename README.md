# Self Pace Note

`Own Pace Loop` のコンセプトで作っている、`自分との比較` を大切にする静的アプリです。

他人との優劣ではなく、

- 前の自分と比べる
- 前進だけでなく、整える日や一歩引く日も肯定する
- 小さな歩幅を積み重ねる

ことを支えるための MVP になっています。

## このアプリでできること

- 今日の自分に合う一歩を生成する
- `進めた / 整えた / 一歩引いた` をそのまま記録する
- 直近 7 日の自分比をふり返る
- Cloud Run / Vertex AI を前提に、あとから AI コーチ機能を足せる

## 主要ファイル

- `index.html`: GitHub Pages ルート用の入口ページ
- `beginner-loop.html`: メイン画面
- `beginner-loop.css`: UI スタイル
- `beginner-loop.js`: ローカル保存と表示ロジック
- `BEGINNER_LOOP_ARCHITECTURE.md`: Google Cloud を使った拡張方針
- `DESIGN.md`: デザイン基準

## 使い方

ビルドは不要です。ブラウザで `index.html` か `beginner-loop.html` を開くと動きます。

Cloud Run を使う場合は、画面内の `Cloud Run API URL` にベース URL を入れると次の API を呼びます。

- `POST /api/challenge`
- `POST /api/weekly-review`

API が未設定または失敗した場合は、ローカル生成にフォールバックします。

## GitHub Pages

このリポジトリは `main` ブランチへの push をきっかけに GitHub Pages へ静的ファイルをデプロイする構成です。

- デプロイ設定: `.github/workflows/deploy-pages.yml`
- 公開対象: ルート直下の `html / css / js / README.md`
- ルートの `index.html` から `beginner-loop.html` へ自動で移動します

## プロダクトの軸

- 他人比較を煽らない
- 後退や休息を失敗扱いしない
- 自認と肯定を続けながら積み重ねる

## 今後の拡張

- Cloud Run API の実装
- Firestore でのログ永続化
- Vertex AI による自分比レビュー生成
- BigQuery を使った継続分析
