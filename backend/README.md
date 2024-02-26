# セットアップ

ローカル環境でFastAPIアプリケーションの挙動を確認するには以下のコマンドのいずれかでアプリケーションを起動できます。

## poetry 環境で動かす

```
$ poetry install
$ poetry shell
$ uvicorn src.server:app --reload
```

## docker で動かす

```
$ docker compose -f docker-compose.dev.yml build
$ docker compose -f docker-compose.dev.yml up
```

## APIの仕様、および、

poetry、および、docker でアプリケーション起動後、http://localhost:8000/docs にアクセスすることで、APIの仕様を確認できます。

各APIの「Try it out」ボタンを押すことで、入力フォームが出現。APIをテスト実行することができます。
