# 健康長寿アドバイザー 公開URL一覧・運用ガイド

> **最終更新:** 2026-10-04  
> **公開基盤:** GitHub Pages (`https://susumu53.github.io/kenko/`)  
> **GitHub リポジトリ:** [https://github.com/susumu53/kenko](https://github.com/susumu53/kenko)

---

## 1. 受講生向け・修了試験＆公式修了証発行URL

note記事や受講生案内メールに掲載するURL一覧です。コースごとのアクセス制限が自動適用されます。

| 対象コース | 出題数 / 合格基準 | 公開URL（クリックでアクセス） | 貼り付け先・用途 |
|---|:---:|---|---|
| **初級コース**<br>（完全無料） | 全20問<br>（14問以上で合格） | [https://susumu53.github.io/kenko/app/certificate/?course=beginner](https://susumu53.github.io/kenko/app/certificate/?course=beginner) | **【note初級 第5回講義記事】末尾**<br>※コースが「初級」に自動固定され、中級・上級への切り替えを抑止します。 |
| **中級コース**<br>（有料受講生限定） | 全30問<br>（21問以上で合格） | [https://susumu53.github.io/kenko/app/certificate/?course=intermediate&key=KLA-MID-2026](https://susumu53.github.io/kenko/app/certificate/?course=intermediate&key=KLA-MID-2026) | **【note中級 有料マガジン最終回記事】末尾**<br>※認証キー（`KLA-MID-2026`）が自動適用され、購入者がスムーズに受験できます。 |
| **上級コース**<br>（認定講師養成） | 全50問<br>（35問以上で合格） | [https://susumu53.github.io/kenko/app/certificate/?course=advanced&key=KLA-ADV-2026](https://susumu53.github.io/kenko/app/certificate/?course=advanced&key=KLA-ADV-2026) | **【note上級 有料マガジン最終回記事】末尾**<br>※認証キー（`KLA-ADV-2026`）が自動適用され、購入者がスムーズに受験できます。 |
| **修了証トップ**<br>（コース選択可） | — | [https://susumu53.github.io/kenko/app/certificate/](https://susumu53.github.io/kenko/app/certificate/) | 汎用リンク（中級・上級の選択には認証キーの入力が必要） |

---

## 2. メインWebアプリ ＆ 外部連携先URL

| サービス | URL | 役割・概要 |
|---|---|---|
| 🌿 **実現健康長寿アプリ（メイン）** | [https://susumu53.github.io/kenko/](https://susumu53.github.io/kenko/) | 健幸五輪モデル・セルフチェック・健康管理アプリ（PWA対応） |
| 📖 **note 公式アカウント** | [https://note.com/hero_as_a_hobbty](https://note.com/hero_as_a_hobbty) | 講義noteマガジン販売、無料告知記事配信 |
| 🎥 **YouTube チャンネル** | [https://studio.youtube.com/channel/UCtgqiWVNp_Rr_n3MHIrmkfg](https://studio.youtube.com/channel/UCtgqiWVNp_Rr_n3MHIrmkfg) | 全19本の講義動画ホスティング（限定公開） |
| 📦 **GitHub リポジトリ** | [https://github.com/susumu53/kenko](https://github.com/susumu53/kenko) | ソースコード・ドキュメント管理リポジトリ |

---

## 3. 受講認証キー（アクセス制限用パスコード）管理表

初級受講生が未購入の中級・上級試験を勝手に受けられないように保護している認証キーです。  
設定箇所: [`app/certificate/certificate.js`](../app/certificate/certificate.js) 内の `COURSE_PASSCODES`

| コース | 認証キー | 備考 |
|---|:---:|---|
| **初級コース** | **不要（なし）** | 誰でも完全無料で受験可能 |
| **中級コース** | `KLA-MID-2026` | note中級有料マガジンの最終回有料エリア内に記載 |
| **上級コース** | `KLA-ADV-2026` | note上級有料マガジンの最終回有料エリア内に記載 |

※認証キーを変更したい場合は、`certificate.js` 内の文字列を書き換えてGitHubにプッシュするだけで即時反映されます。

---

## 4. 管理者用機能（修了者台帳 ＆ Googleスプレッドシート連携）

### ① 発行者台帳の確認とCSVダウンロード
1. 修了証発行アプリ（[https://susumu53.github.io/kenko/app/certificate/](https://susumu53.github.io/kenko/app/certificate/)）をブラウザで開きます。
2. 画面右上の **「📋 管理者台帳」** ボタン（またはフッター最下部のリンク）をクリックします。
3. 発行された全受講者の「発行日時」「証明番号」「お名前」「メールアドレス」「コース」「試験得点」が一覧表示されます。
4. **「CSVでダウンロード」** ボタンを押すと、Excelでそのまま開けるUTF-8 BOM付きCSVファイルとして手元に保存できます。

### ② Googleスプレッドシートへのリアルタイム自動保存（Webhook）
受講者が修了証を発行した瞬間に、管理者のGoogleスプレッドシートへ自動記帳する機能です。  
設定方法は [`docs/GAS_SPREADSHEET_SETUP.md`](GAS_SPREADSHEET_SETUP.md) をご覧ください。
