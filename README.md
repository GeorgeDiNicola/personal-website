# Personal Website
Personal website and portfolio designed to showcase technical problem-solving and software development projects.

## Live Jeopardy predictions

The Jeopardy project page at `/projects/jeopardy/` fetches `jeopardy-predictions.xlsx` directly from the public
[Kaggle dataset](https://www.kaggle.com/datasets/georgejdinicola/jeopardy-predictions)
on each page load. Predictions are not
included in the static build. Kaggle must make a new dataset version available
before it can appear here.

The last nonempty row is the latest prediction. The card uses **Next Episode Date**
and **Next Episode Number**, because each prediction concerns the champion's next
game. **Win Probability** is a percentage from 0 to 100. Accuracy compares
**Prediction** with **Result** only when **Status** is `Closed` and the result is
present; other rows remain pending. History is displayed by next episode date.

The browser needs Kaggle's download endpoint to continue allowing cross-origin
requests. Unavailable or unexpected data shows a retry message;
there is no static fallback that could look like a current prediction.

Run the scoring checks with `pnpm exec node --test components/personal/jeopardy-data.test.mjs`.

# Licensing
The code in this repository is licensed under the MIT License.
The content (prose, project descriptions, and images) is © 2026 George DiNicola. All Rights Reserved. You may not reproduce my personal branding, images, work history, or project work text without explicit permission.
