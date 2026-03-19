# 環境構築手順書

# 1 本書について

本書では、建物振動シミュレーションシステム（以下「本システム」という。）の利用環境構築手順について記載しています。本システムの構成や仕様の詳細については以下も参考にしてください。

[技術検証レポート](https://www.mlit.go.jp/plateau/file/libraries/doc/plateau_tech_doc_0030_ver01.pdf)

# 2 動作環境

本システムの動作環境は以下のとおりです。

| 項目 | 最小動作環境 | 推奨動作環境 |
| - | - | - |
| WEBブラウザ | 特に縛りは無い | Google Chrome |
| CPU | Intel Core i3以上 | Intel Core i5以上 |
| メモリ | 4GB以上 | 8GB以上 |
| ディスプレイ解像度 | 1024×768以上 |  同左  |
| ネットワーク       | 光回線|  同左                            |

# 3 利用技術

| カテゴリ | 技術 |
| --- | --- |
| フロントエンド | SvelteKit 2.x, TypeScript, Svelte 5, Tailwind CSS |
| UIコンポーネント | Melt UI, Svelte Hero Icons |
| 地図・可視化 | MapLibre GL, Deck.gl, Terra Draw, Chart.js |
| バックエンド | AWS Lambda, Amazon DynamoDB, Amazon S3, AWS Batch |
| 認証 | Amazon Cognito, AWS Amplify Auth |
| インフラ | AWS CDK (TypeScript) |
| モノレポ管理 | Turborepo, pnpm workspace |
| ビルドツール | Vite, pnpm |

# 4 フォルダ構成

本プロジェクトはTurborepoを使用したモノレポ構成になっています。

```text
/
├── apps/
│   ├── admin/                  # 管理システム (wide/narrow機能)
│   └── viewer/                 # ビューワーアプリケーション
├── packages/
│   ├── shared/                 # 共有型定義・ユーティリティ
│   ├── ui/                     # 共通UIコンポーネント
│   ├── aws-client/             # AWS SDKクライアント
│   └── config/                 # 共通設定
└── cdk/                        # AWS CDKインフラストラクチャ
    ├── backend-stack/          # バックエンドリソース
    ├── platform-stack/         # Cognitoなどのプラットフォーム
    ├── narrowsim-batch-stack/  # 狭域シミュレーションバッチ
    └── widesim-batch-stack/    # 広域シミュレーションバッチ
```

# 5 必要な環境

- **Node.js**: >= 22.0.0 (推奨: 22.18.0)
- **pnpm**: >= 9.11.0
- **mise**: Node.jsバージョン管理に使用（`.tool-versions`で管理）
- **Docker**: ローカル開発環境の一部で使用

# 6 ビルド手順

### ビルドの準備

自身でソースファイルをダウンロードしビルドを行うことで、システムを動作させることができます。\
ソースファイルは
[こちら](https://github.com/Project-PLATEAU/Earthquake-simulation-tools/)
からダウンロード可能です。

#### 1. 依存関係のインストール

パッケージマネージャーとして [pnpm](https://pnpm.io/ja/installation) を使用します。

```bash
pnpm install
```

#### 2. 環境変数の設定

`.env.example`を参考に`.env`ファイルを作成してください。

```bash
cp .env.example .env
# .envファイルを編集
```

`apps/viewer/.env.example`を参考に`apps/viewer/.env`ファイルを作成してください。

```bash
cp apps/viewer/.env.example apps/viewer/.env
# .envファイルを編集
```

#### 3. ローカル開発環境の起動（Docker）

```bash
make docker_build    # DynamoDBとMinIOを起動
make data_init       # 初期データを投入
```

### 開発コマンド

#### 開発サーバーの起動

```bash
# 全アプリを起動
pnpm dev

# 管理システムのみ起動 (http://localhost:5173)
pnpm dev:admin

# ビューワーのみ起動 (http://localhost:5174)
pnpm dev:viewer

# Makefileを使用
make dev          # 全アプリ
make dev_admin    # 管理システム
make dev_viewer   # ビューワー
```

### ビルド実行

```bash
# 全アプリをビルド
pnpm build

# 管理システムのみビルド
pnpm build:admin

# ビューワーのみビルド
pnpm build:viewer

# Makefileを使用（管理システムのみ）
make svelte_build
```

### コード品質

```bash
# Lint実行
pnpm lint

# フォーマット
pnpm format

# 型チェック
pnpm check

# テスト実行
pnpm test
```

### その他

```bash
# ビルド成果物の削除
pnpm clean

# node_modules削除
make remove_node_modules
```

# 7 デプロイ

### フロントエンドのデプロイ

管理システム（admin）とビューワー（viewer）は独立してデプロイ可能です。

```bash
# 管理システムのビルド
pnpm build:admin

# ビューワーのビルド
pnpm build:viewer
```

ビルド成果物は各アプリの`build/`ディレクトリに生成されます。

### バックエンドのデプロイ (AWS CDK)

```bash
# バックエンドスタック
make cdk_deploy_backend

# プラットフォームスタック
make cdk_deploy_platform

# 狭域シミュレーションバッチ
make cdk_deploy_narrow

# 広域シミュレーションバッチ
make cdk_deploy_wide
```

# 8 アプリケーション

### 管理システム (admin)

- **URL**: http://localhost:5173
- **機能**:
  - 広域シミュレーション管理
  - 狭域シミュレーション管理
  - プリセット管理
  - シミュレーション予約

### ビューワー (viewer)

- **URL**: http://localhost:5174
- **機能**:
  - シミュレーション結果の可視化
    - S3からの実データ取得（本番環境）
    - モックデータによるフォールバック（開発環境）
  - 建物被害ダッシュボード
  - 道路閉塞ダッシュボード
  - インタラクティブマップ
  - 過去のシミュレーション一覧表示
  - デバッグモード対応（`?debug=true`パラメータ）

### 認証

- AWS Cognitoを使用
- ユーザーロール: admin, operator, viewer
- 管理システムへのアクセスには認証が必要

# 9 トラブルシューティング

### Node.jsバージョンエラー

```bash
# miseでNode.jsをインストール
mise install node@22.18.0

# .tool-versionsが正しく設定されているか確認
cat .tool-versions
# 出力: nodejs 22.18.0

# 現在のバージョンを確認
mise current node
```

### ビルドエラー

```bash
# 依存関係の再インストール
rm -rf node_modules
pnpm install

# キャッシュのクリア
pnpm clean
rm -rf .turbo
```

### Docker関連

```bash
# コンテナを停止して削除
make docker_down

# 再起動
make docker_build
make data_init
```

### 型エラー

```bash
# 型チェック実行
pnpm check

# SvelteKitの同期
cd apps/admin  # または apps/viewer
npx svelte-kit sync
```

### S3接続エラー（開発環境）

開発環境でS3/MinIOが起動していない場合、以下のようにデバッグモードを使用できます:

```text
# デバッグモード（モックデータを使用）
# ブラウザで以下のURLにアクセス
http://localhost:5174/?debug=true
```

または、MinIOを起動:

```bash
make docker_build
```
