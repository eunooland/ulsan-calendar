# 울산 행사 캘린더 운영 안내

## 폴더 구성
- `docs/` 공개되는 사이트 전체. `index.html` + `data/`
  - `data/events.json` 승인된 행사·전시·공연 (달력에 보임)
  - `data/experiences.json` 승인된 체험 (체험 탭에 보임)
  - (승인 대기는 `pending/pending.json`에 두며 공개 저장소에 올리지 않습니다)
- `scripts/approve.mjs` 승인 처리: `node scripts/approve.mjs 101 102` / `--all` / `--reject 103`
- `archive/prototype.html` 처음 만든 시안(데이터가 안에 들어 있음, 공개되지 않음)

## 항목 형식 (pending.json에 쌓는 형식)
- 공통: `id, title, start, end(또는 days[]), time, place, fee, src(출처 링크), chk(확인 날짜 문구)`
- 행사·전시·공연: `kind:"event"`, `cat: event|exhib|perf`, `closed:[요일]`(휴관 요일, 선택), `note`(선택), `paid:1`(유료일 때)
- 체험: `kind:"experience"`, `ages:[영유아|초등저학년|초등고학년|중학생|고등학생|성인|가족전체]`(미기재면 빈 배열), `apply`(신청 링크 또는 null), `applyLabel`, `deadline`, `isNew`
- 확인이 덜 된 값은 추측하지 않고 `reason`에 이유를 적습니다.

## 월요일 자동 흐름 (예정)
1. 월요일 오전 PC가 켜져 있으면 조사 작업이 실행됩니다.
2. 새 항목을 `pending/pending.json`에 넣고, 확인 필요 항목에는 `reason`을 적습니다.
3. 카카오톡 "나에게 보내기"로 승인 대기 목록을 보냅니다.
4. 사용자가 이 화면에서 "승인 101 102" 또는 "전부 승인"이라고 답하면 `approve.mjs`로 옮기고 사이트에 올립니다.
5. 하루 두 번(오전 9시·오후 5시) 새 체험 요약을 보냅니다.

## 아직 사용자 쪽에서 필요한 것
- GitHub 계정 로그인(`gh auth login`)과 사이트 저장소 생성
- 카카오 개발자 앱 등록과 "나에게 보내기" 토큰 발급
- 웹 푸시(팔로워 알림)는 서버 쪽 구성이 필요해서 2단계 이후에 진행
