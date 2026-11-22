/**
 * 배정철어도 사이트 문의 → 지메일 전달
 *
 * 이 스크립트를 배포한 구글 계정의 지메일로 문의가 도착합니다.
 * 받는 주소를 코드에 적지 않으므로, 이 파일이 공개되어도 메일 주소는 드러나지 않습니다.
 * 권한: 메일 "보내기"만 사용합니다 (메일함을 읽지 않습니다).
 */

const SITE = '배정철어도';
const DAILY_LIMIT = 40;          // 하루 최대 전달 건수 (스팸 폭주 방지)
const MAX_MESSAGE = 2000;        // 내용 최대 글자 수

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // 보이지 않는 함정 칸에 값이 있으면 스팸으로 보고 조용히 성공 처리
    if (d.botcheck) return json({ success: true });

    const kind = d.kind === '예약 문의' ? '예약 문의' : '의견';
    const message = clean(d.message, MAX_MESSAGE);
    const name = clean(d.name, 40);
    const phone = clean(d.phone, 20);
    if (!message) return json({ success: false, message: '내용이 없습니다.' });
    if (kind === '예약 문의' && (!name || !phone)) return json({ success: false, message: '이름과 연락처가 필요합니다.' });
    if ((name || phone) && d.consent !== true) return json({ success: false, message: '개인정보 동의가 필요합니다.' });

    if (!underDailyLimit()) return json({ success: false, message: '오늘은 더 받을 수 없습니다.' });

    const lines = ['종류: ' + kind];
    if (kind === '예약 문의') {
      lines.push('희망: ' + (clean(d.date, 10) || '-') + ' ' + clean(d.time, 5) + ' · ' + (clean(d.people, 3) || '-') + '명');
    }
    lines.push('이름: ' + (name || '-'), '연락처: ' + (phone || '-'), '', message, '',
      '— ' + SITE + ' 사이트 문의 양식 · 개인정보는 답변 후 3개월 안에 삭제해 주세요.');

    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      subject: '[' + SITE + '] ' + kind + (name ? ' - ' + name : ''),
      body: lines.join('\n'),
      name: SITE + ' 사이트'
    });
    return json({ success: true });
  } catch (err) {
    return json({ success: false, message: '처리 중 오류가 났습니다.' });
  }
}

// 브라우저로 주소를 열었을 때 확인용
function doGet() {
  return json({ ok: true, site: SITE });
}

function clean(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

function underDailyLimit() {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const props = PropertiesService.getScriptProperties();
    const today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
    const count = props.getProperty('day') === today ? Number(props.getProperty('count') || 0) : 0;
    if (count >= DAILY_LIMIT) return false;
    props.setProperties({ day: today, count: String(count + 1) });
    return true;
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
