# 修了証発行者（氏名・メールアドレス）のGoogleスプレッドシート自動記録 設定ガイド

健康長寿アドバイザー認定システム（GitHub Pages）で受講生が修了証を発行した際に、**「お名前」「メールアドレス」「コース」「得点」「証明番号」「発行日時」を管理者のGoogleスプレッドシートへリアルタイムに自動追加**する設定マニュアルです。

完全無料・サーバー不要（Google Apps Script: GAS）で5分で設定できます。

---

## 1. Google スプレッドシートの作成

1. [Google スプレッドシート](https://sheets.new) を新規作成します。
2. シート名を任意で設定（例: `健康長寿アドバイザー 修了者台帳`）。
3. 1行目の見出し（A1〜G1）に以下を入力します：

| A列 | B列 | C列 | D列 | E列 | F列 | G列 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **発行日時** | **証明番号** | **お名前** | **メールアドレス** | **コース** | **試験得点** | **合格日** |

---

## 2. Google Apps Script（GAS）コードの貼り付け

1. スプレッドシート上部メニューの **「拡張機能」>「Apps Script」** をクリックします。
2. エディタに表示されている既存のコードを全消去し、以下のスクリプトを貼り付けます：

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data;
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var row = [
      data.issuedAt || new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      data.certId || '',
      data.name || '',
      data.email || '',
      data.course || '',
      data.score || '',
      data.date || ''
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. 画面上部の **「保存」アイコン（フロッピーマーク）** をクリックします。

---

## 3. ウェブアプリとしてデプロイ

1. 画面右上の青い **「デプロイ」>「新しいデプロイ」** をクリックします。
2. 左側の歯車アイコンをクリックし、**「ウェブアプリ」** を選択します。
3. 以下の通り設定します：
   - **説明:** `修了証自動記帳Webhook`
   - **次のユーザーとして実行:** `自分`
   - **アクセスできるユーザー:** **`全員`**（※これを選択しないとWebアプリから書き込めません）
4. **「デプロイ」** ボタンを押します。
   - ※初回のみGoogleのアクセス承認画面（「アクセスを承認」➔ 詳細を表示 ➔ 安全ではないページに移動）が表示されますので許可してください。
5. 表示された **「ウェブアプリのURL」**（`https://script.google.com/macros/s/XXXXX/exec`）をコピーします。

---

## 4. Webアプリ（`certificate.js`）へのURL設定

1. リポジトリ内の [`app/certificate/certificate.js`](file:///c:/Users/user/Desktop/desktop/kenko/app/certificate/certificate.js) を開きます。
2. 先頭の `CONFIG` オブジェクト内にある `GOOGLE_SHEETS_WEBHOOK_URL` に、コピーしたURLを貼り付けます：

```javascript
const CONFIG = {
  GOOGLE_SHEETS_WEBHOOK_URL: 'https://script.google.com/macros/s/あなたのID/exec',
  STORAGE_KEY: 'kenko_certificates',
};
```

3. ファイルを保存し、GitHubにプッシュ（コミット）します。

---

## 5. 動作確認

1. `app/certificate/index.html` をブラウザで開き、テストとして「氏名」「メールアドレス」を入力して試験を受験・合格します。
2. 「修了証を確定しPDFダウンロード」をクリックします。
3. 指定したGoogleスプレッドシートに、受講者の行が自動で瞬時に追加されれば連携完了です！

> [!NOTE]
> **ローカル台帳について:**
> 本設定を行わなくても、ブラウザ内（`localStorage`）には全発行履歴が自動保存されます。
> 画面右上の **「📋 管理者台帳」** ボタンを押せば、いつでも一覧の確認や **CSVダウンロード** が可能です。
