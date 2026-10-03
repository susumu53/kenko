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
| 4 | 修了試験＆修了証発行の一体化Webアプリ開発 | Phase 2 | **AG** | ✅ 完了 | GitHub Pagesで完全一体化。初級20問・中級30問（初級＋中級知識）・上級50問（中級＋上級知識）の計100問実装。70%合格判定、氏名・メアド記録、CSV台帳、GoogleスプレッドシートWebhook完備。[app/certificate/](file:///c:/Users/user/Desktop/desktop/kenko/app/certificate/index.html) に配置 |
| 5 | 初級・中級・上級 講義テキスト・note原稿作成 | Phase 3 | ユーザー+AG | ✅ 完了 | [docs/note-beginner-lectures-complete.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/note-beginner-lectures-complete.md)（第1回〜第5回全編完備・一体化試験導線更新済）および告知記事完成 |
| 6 | 中級コース（有料マガジン・6記事）作成 | Phase 3 | ユーザー+AG | 🟡 AG原稿完成 | [docs/note-course-articles-draft.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/note-course-articles-draft.md) にマガジン設定＋全6記事構成を用意済 |
| 7 | 上級コース（有料マガジン・8記事）作成 | Phase 3 | ユーザー+AG | 🟡 AG原稿完成 | [docs/note-course-articles-draft.md](file:///c:/Users/user/Desktop/desktop/kenko/docs/note-course-articles-draft.md) にマガジン設定＋全8記事構成を用意済 |
| 8 | エンドツーエンドテスト | Phase 4 | ユーザー+AG | ⬜ 未着手 | PC + スマホで動作検証 |
| 9 | 公開・告知 | Phase 4 | ユーザー | ⬜ 未着手 | note + SNS + WordPress |

## 🔧 技術構成（確定）

| 項目 | 選択 | 費用 |
|---|---|---|
| コンテンツ販売・決済 | note 有料マガジン | 手数料15〜20%（売れた時のみ） |
| 動画ホスティング | YouTube 限定公開 | ¥0 |
| 修了試験 ＆ 修了証発行 | GitHub Pages一体化Webアプリ（[app/certificate/](file:///c:/Users/user/Desktop/desktop/kenko/app/certificate/index.html)） | ¥0 |
| 受講者記録（氏名・メール） | ブラウザ内台帳（CSV出力）＋ Googleスプレッドシート自動Webhook | ¥0 |
| **合計固定費** | | **¥0** |
