# 健康長寿アドバイザー オンライン受講システム — タスクトラッカー

> 最終更新: 2026-10-03 09:10（JST）
> 計画書: [2026-10-03-note-hybrid-implementation.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/plans/2026-10-03-note-hybrid-implementation.md)
> 実施記録: [SYSTEM_IMPLEMENTATION_RECORD.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/SYSTEM_IMPLEMENTATION_RECORD.md)
> 旧計画書（MOSH版・廃止）: [2026-10-03-mosh-online-course-implementation.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/plans/2026-10-03-mosh-online-course-implementation.md)
> 旧計画書（KOMOJU版・廃止）: [2026-10-02-online-course-implementation.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/plans/2026-10-02-online-course-implementation.md)

## 📌 プロジェクト概要

note 有料マガジン + 自作EdTechツール（修了試験・修了証発行）でオンライン受講システムを構築

> **戦略:** noteの集客力（MAU 7,359万）で受講者を獲得し、Google Forms修了試験 + 自作修了証発行アプリで差別化。法人登録不要・固定費ゼロ。

## 📊 進捗

| # | タスク | Phase | 担当 | ステータス | 備考 |
|---|---|---|---|---|---|
| 1 | YouTube に講義動画アップロード（19本） | Phase 1 | ユーザー | ✅ 完了 | 19本全動画のアップロード完了（限定公開） |
| 2 | note アカウント・プロフィール連携 | Phase 1 | ユーザー+AG | ✅ 連携済 | アカウント確認済（[https://note.com/hero_as_a_hobbty](https://note.com/hero_as_a_hobbty)） |
| 3 | 無料記事を投稿（集客・信頼構築） | Phase 1 | ユーザー+AG | 🟡 AG下書き完了 | 5本の下書きを [docs/note-free-articles-draft.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/note-free-articles-draft.md) に作成済（リンク最適化済） |
| 4 | 修了試験＆修了証発行の一体化Webアプリ開発 | Phase 2 | **AG** | ✅ 完了 | スマホ表示・レスポンシブ最適化完了（[app/certificate/certificate.css](file:///c:/Users/user/Desktop/desktop/kenko/app/certificate/certificate.css)）。初級・中級・上級の試験問題（[app/certificate/quiz-data.js](file:///c:/Users/user/Desktop/desktop/kenko/app/certificate/quiz-data.js)）も講義内容に完全準拠済 |
| 5 | 初級・中級・上級 講義テキスト・note原稿作成 | Phase 3 | ユーザー+AG | ✅ 完了 | 第3回を「つながり（SDH・孤立予防）」、第5回を「栄養アプローチ＆修了試験」へ再構成完了。[docs/note-beginner-lectures-complete.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/note-beginner-lectures-complete.md) 等整合済 |
| 6 | 中級コース（有料マガジン・6記事）作成 | Phase 3 | ユーザー+AG | 🟡 AG原稿完成 | [docs/note-course-articles-draft.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/note-course-articles-draft.md) にマガジン設定＋全6記事構成を用意済 |
| 7 | 上級コース（有料マガジン・8記事）作成 | Phase 3 | ユーザー+AG | 🟡 AG原稿完成 | [docs/note-course-articles-draft.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/note-course-articles-draft.md) にマガジン設定＋全8記事構成を用意済 |
| 8 | エンドツーエンドテスト | Phase 4 | ユーザー+AG | ⬜ 未着手 | PC + スマホで動作検証 |
| 9 | 公開・告知 | Phase 4 | ユーザー | ⬜ 未着手 | note + SNS + WordPress |
| 10 | 「いのちを学ぶ基礎講座」講義テキストの整備 | Inochi-P1 | **AG** | ✅ 完了 | 全7回＋事例演習＋言葉かけ早見表の公式テキスト化（[docs/inochi-course-textbook.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/inochi-course-textbook.md)） |
| 11 | 「いのちを学ぶ基礎講座」試験問題（全25問・解説付）設計 | Inochi-P2 | **AG** | ✅ 完了 | 第1回〜第7回・事例統合から厳選した四肢択一試験問題作成（[app/inochi-certificate/quiz-data.js](file:///c:/Users/user/Desktop/desktop/kenko/app/inochi-certificate/quiz-data.js)） |
| 12 | 「いのちを学ぶ基礎講座」修了試験＆修了証発行Webアプリ開発 | Inochi-P3 | **AG** | ✅ 完了 | [app/inochi-certificate/](file:///c:/Users/user/Desktop/desktop/kenko/app/inochi-certificate/index.html) にHTML/CSS/JS/PDF発行システム構築完了 |
| 13 | アプリポータル・ナビゲーション連携と動作検証 | Inochi-P4 | **AG** | ✅ 完了 | エデュケーション画面および既存修了証アプリとの相互リンク・バリデーション完了 |

## 🔧 技術構成（確定）

| 項目 | 選択 | 費用 |
|---|---|---|
| コンテンツ販売・決済 | note 有料マガジン | 手数料15〜20%（売れた時のみ） |
| 動画ホスティング | YouTube 限定公開 | ¥0 |
| 修了試験 ＆ 修了証発行 | GitHub Pages一体化Webアプリ（[app/certificate/](file:///c:/Users/user/Desktop/desktop/kenko/app/certificate/index.html)） | ¥0 |
| 受講者記録（氏名・メール） | ブラウザ内台帳（CSV出力）＋ Googleスプレッドシート自動Webhook | ¥0 |
| **合計固定費** | | **¥0** |
