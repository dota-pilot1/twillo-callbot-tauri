# Twillo Callbot 타우리 배포 가이드

## 기준 경로

- 로컬 원본: `/Users/terecal/twillo-callbot/twillo-callbot-tauri`
- GitHub repo: `dota-pilot1/twillo-callbot-tauri`
- 릴리즈 주소: `https://github.com/dota-pilot1/twillo-callbot-tauri/releases/latest`
- Tauri updater endpoint: `https://github.com/dota-pilot1/twillo-callbot-tauri/releases/latest/download/latest.json`

## GitHub Actions Secrets

Repository secrets에 아래 8개 값이 필요하다 (모두 등록 완료).

```text
TAURI_SIGNING_PRIVATE_KEY        ← Tauri 업데이터 서명 키
TAURI_SIGNING_PRIVATE_KEY_PASSWORD ← (빈 문자열)
APPLE_CERTIFICATE                ← Developer ID p12 base64
APPLE_CERTIFICATE_PASSWORD       ← p12 비밀번호
APPLE_SIGNING_IDENTITY           ← Developer ID Application: Hyunseok oh (5PRM3RRTSH)
APPLE_ID                         ← Apple 계정 이메일
APPLE_PASSWORD                   ← App-Specific Password
APPLE_TEAM_ID                    ← 5PRM3RRTSH
```

값 자체는 `.local-secrets/` 에 로컬 보관 (.gitignore 제외됨).

## 릴리즈 절차

```bash
cd /Users/terecal/twillo-callbot/twillo-callbot-tauri

# 1. 버전 올리기
#    - package.json
#    - src-tauri/tauri.conf.json
npm version patch --no-git-tag-version
# tauri.conf.json 도 같은 버전으로 맞추기

# 2. 커밋
git add -A
git commit -m "Release v0.1.x"

# 3. 태그 푸시 → GitHub Actions 자동 빌드
git tag v0.1.x
git push origin master
git push origin v0.1.x
```

태그를 푸시하면 GitHub Actions가 자동으로:
- macOS: universal binary (.dmg) 빌드 + Apple 코드 서명 + 공증
- Windows: NSIS 설치 파일 (.exe) 빌드
- GitHub Releases에 업로드 + latest.json 생성

## 자동 업데이트

앱 시작 시 `checkForUpdates()` 가 `latest.json` 을 확인하고, 새 버전이 있으면 사용자에게 업데이트를 제안한다.

## 배포 전 확인

- [ ] `npm run tauri build` 로컬 빌드 통과
- [ ] 앱 로그인 성공
- [ ] 헤더 드래그/최소화/최대화/닫기 동작
- [ ] 소프트폰 페이지 정상 렌더
- [ ] 앱 버전과 릴리즈 태그 일치

## 시크릿 재등록 방법

```bash
SECRETS_DIR="배포 가이드/.local-secrets"
REPO="dota-pilot1/twillo-callbot-tauri"

gh secret set TAURI_SIGNING_PRIVATE_KEY --repo $REPO < "$SECRETS_DIR/tauri-updater.key"
gh secret set TAURI_SIGNING_PRIVATE_KEY_PASSWORD --repo $REPO --body ""
gh secret set APPLE_CERTIFICATE --repo $REPO < "$SECRETS_DIR/apple_certificate_base64.txt"
gh secret set APPLE_CERTIFICATE_PASSWORD --repo $REPO < "$SECRETS_DIR/apple_certificate_password.txt"

# apple-credentials.txt 에서 나머지 4개 값 복사
gh secret set APPLE_SIGNING_IDENTITY --repo $REPO --body "Developer ID Application: Hyunseok oh (5PRM3RRTSH)"
gh secret set APPLE_ID --repo $REPO --body "terecal@daum.net"
gh secret set APPLE_PASSWORD --repo $REPO --body "<App-Specific Password>"
gh secret set APPLE_TEAM_ID --repo $REPO --body "5PRM3RRTSH"
```
