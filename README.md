# 建物振動シミュレーションシステム


![img1](docs/resources/index_img1.png)

## 1. 概要

本リポジトリでは、Project PLATEAUの令和5年度「都市デジタルツインの実現に向けた研究開発及び実証調査業務」（内閣府/研究開発とSociety5.0との橋渡しプログラム（BRIDGE））におけるuc23-24「3D都市モデルを活用した建物振動シミュレーションシステムの開発」（建物振動に関する大規模シミュレーション）において開発した「建物振動シミュレーションシステム」のソースコードを公開しています。

「建物振動シミュレーションシステム」は、システムで提供する計算に必要な属性情報を含むProject PLATEAUの建物3Dモデル、および、地震動ファイルを入力パラメータとして、スーパーコンピューターをはじめとする様々な地震動シミュレーターに対し計算を依頼します。

その後、得られた計算結果から可視化ファイルを生成。最終的にWebブラウザ上で、指定した地域にて、指定した地震動ファイルの大規模地震が起きた際の被害状況を可視化することによって、大きな被害が予測されるエリアの特定するなど、都道府県・市町村の事前の防災検討に活用できることを目指したシステムです。

## 2.「建物振動シミュレーションシステム」について

「建物振動シミュレーションシステム」は、Project PLATEAUで提供している3D建物データの属性を防災の用途に活用することを目的に開発しました。

本システムは、一般ユーザ向けにGUIを備えたオープンソースソフトウェアとしてフルスクラッチで開発されています。

## 3. 利用手順

本システムの構築手順及び利用手順については [利用マニュアル](https://project-plateau.github.io/Earthquake-simulation-tools/index.html) を参照してください。

## 4. システム概要

【建物振動シミュレーションシステム】

本システムは、以下の機能を提供します。

[ログイン/ユーザ登録]
- ユーザは、ログイン画面にてユーザIDとパスワードを入力し、ログインすることができます。
- ユーザは、ユーザ登録画面にてユーザID、パスワード、メールアドレスを入力し、ユーザ登録することができます。

[シミュレーション利用パラメータプリセット登録]
- シミュレーションの計算を予約する際に指定するCityGML, 地震動パラメータをシステムに予め登録しておき、予約フォームで選択して登録するためのマスタ管理画面です。
- 登録済みのプリセット情報はシステムにログインできるすべてのユーザに共有されます。

[シミュレーション計算予約登録フォーム]
- シミュレーション計算の予約を登録するための登録フォームです。
- 利用するCityGML、地震動パラメータを指定し、計算を予約することができます。
- 予約登録後、計算処理の手続きは自動で行われる。

[シミュレーション計算詳細画面]
- 登録済みのシミュレーション計算の進捗状況を確認するための画面です。
- シミュレーション計算が完了し、可視化用データの加工が完了したあと、可視化結果を確認することができます。

[シミュレーション計算結果可視化処理]
- IESによるシミュレーション計算結果を可視化するための処理です。
- 計算結果で得られた可視化用ファイルを加工。指定したCityGMLと計算結果を組み合わせた可視化ファイルを生成します。

[計算結果可視化画面]
- シミュレーション計算結果の可視化画面です。
- 地図上にCityGML建物、および、シミュレーションで得られた計算結果を可視化します。
- 建物の被害状況を色別に表示することができます。
- 避難所情報、緊急輸送道路等の情報を表示することができます。

## 5. 利用技術

| 種別              | 名称   | バージョン | 内容 |
| ----------------- | --------|-------------|-----------------------------|
| プログラミング言語 | Python  | 3.11       | ・シミュレーション管理システムのバックエンド側Webアプリケーションの開発で利用・シミュレーション管理システムのバックエンド側Webアプリケーション・スパコンに渡すデータを加工する場合のデータコンバータープログラム・シミュレーション結果の加工処理プログラム |
| ライブラリ | GDAL  |       | ・ラスタ・ベクタ処理用オープンソースGISライブラリ・計算結果の可視化加工処理のデータコンバータープログラムで利用 |
| ライブラリ | GeoPandas  |       | ・Pythonで大量の数値データを加工するために利用するPandasのGEO対応版・計算結果の可視化加工処理のデータコンバータープログラムで利用 |
| ライブラリ | AWS Lambda  |       | ・AWS環境でのアプリケーションサーバ実行環境として利用 |
| サービス | AWS Cognito |       | ・システムのログイン認証機能を提供 |
| サービス | AWS SES |       | ・システムからメールを送る場合に利用するメール配信サービス |
| サービス | AWS S3  |       | ・AWSで提供するオブジェクトストレージ ・システムのプリセット情報の管理に利用 ・可視化ページのコンテンツで利用 |
| サービス | AWS RDS |       | ・AWSが提供するデータベースシステム |
| サービス | AWS ECR |       | ・Lambdaデプロイ用のDockerコンテナ管理環境 |
| サービス | AWS ECS |       | ・Dockerコンテナの実行・停止・管理サービス |
| サービス | IES |       | ・広域データ計算用、スーパーコンピューターの振動シミュレーションソフトウェア |

## 6. 動作環境

| 項目               | 最小動作環境                                                                                                                                                                                                                                                                                                                                    | 推奨動作環境                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| OS                 | Microsoft Windows 10 または 11, Mac OS                                                                                                                                                                                                                                                                                                                |  同左 |
| CPU                | Intel Core i3以上                                                                                                                                                                                                                                                                                                                               | Intel Core i5以上              |
| メモリ             | 4GB以上                                                                                                                                                                                                                                                                                                                                         | 8GB以上                        |
| ディスプレイ解像度 | 1024×768以上                                                                                                                                                                                                                                                                                                                               |  同左                            |                                                                                                                                                                                                                                                                                                                                          |  同左                   |
| ネットワーク       | 100Mbps以上 |  同左                            |

## 7. 本リポジトリのフォルダ構成

| フォルダ名 |　詳細 |
|-|-|
| backend | シミュレーション管理システムのバックエンド側Webアプリケーション |
| frontend | シミュレーション管理システムのフロントエンド側Webアプリケーション |

## 8. ライセンス

- ソースコード及び関連ドキュメントの著作権は国土交通省に帰属します。
- 本ドキュメントは[Project PLATEAUのサイトポリシー](https://www.mlit.go.jp/plateau/site-policy/)（CCBY4.0及び政府標準利用規約2.0）に従い提供されています。

## 9. 注意事項

- 本リポジトリは参考資料として提供しているものです。動作保証は行っていません。
- 本リポジトリについては予告なく変更又は削除をする可能性があります。
- 本リポジトリの利用により生じた損失及び損害等について、国土交通省はいかなる責任も負わないものとします。

## 10. 参考資料 <!-- 技術検証レポートのURLはアクセンチュアにて記載します。 -->

- PLATEAU WebサイトのUse caseページxxxx
