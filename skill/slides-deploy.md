---
name: slides-deploy
description: Publish approved slide HTML to the GitHub Pages lecture archive using the repository GitHub Actions workflow.
---

# Slides Deploy

최종 승인된 강의 HTML을 GitHub Pages 강의 아카이브로 배포할 때 사용한다.

## Current Deployment Contract

이 저장소는 `.github/workflows/deploy-pages.yml`로 `_site/`를 GitHub Pages에 배포한다.

- `bash scripts/build-pages.sh`로 `_site/` 생성
- `actions/upload-pages-artifact`로 Pages artifact 업로드
- `actions/deploy-pages`로 GitHub Pages 배포
- 자동 배포 트리거는 `main` 브랜치 push
- 변경 감지 경로는 `slides/**/*.html`, `slides/images/**`, `scripts/build-pages.sh`, workflow 파일
- `workflow_dispatch`로 수동 실행 가능

## Pre-Deploy Checklist

1. source `.md`와 generated `.html`이 동기화되어 있다.
2. feedback memo 항목이 완료되었거나 열린 항목으로 명확히 남아 있다.
3. `bash scripts/build-pages.sh`가 로컬에서 성공한다.
4. `_site/`에 강의가 포함되고 index가 갱신된다.
5. source, generated HTML, images, feedback memo, template 변경을 커밋한다.

## Publish Flow

1. 작업 브랜치에서 승인된 변경을 커밋한다.
2. `main`으로 merge 또는 fast-forward 한다.
3. `main`을 push 해서 GitHub Actions Pages 배포를 트리거한다.
4. workflow 성공 여부와 GitHub Pages URL을 확인한다.

현재 자동 배포는 `develop`이 아니라 `main` 기준이다. 사용자가 현재 브랜치에서 배포를 요청하면 workflow가 자동 실행되는지 먼저 확인한다.
