const axios = require("axios");

const TOKEN = process.env.GITLAB_TOKEN;
const PROJECT_ID = process.env.CI_PROJECT_ID;
const MR_IID = process.env.CI_MERGE_REQUEST_IID;

const headers = {
  "PRIVATE-TOKEN": TOKEN,
};

// 🔹 Get MR changes
async function getChanges() {
  const res = await axios.get(
    `https://gitlab.com/api/v4/projects/${PROJECT_ID}/merge_requests/${MR_IID}/changes`,
    { headers }
  );
  return res.data.changes;
}

// 🔹 Fake AI review (replace later)
function reviewCode(diff) {
  return "⚠️ Avoid console.log and improve error handling.";
}

// 🔹 Post comment
async function postComment(body) {
  await axios.post(
    `https://gitlab.com/api/v4/projects/${PROJECT_ID}/merge_requests/${MR_IID}/notes`,
    { body },
    { headers }
  );
}

// 🔹 Main
(async () => {
  const changes = await getChanges();

  for (const file of changes) {
    const review = reviewCode(file.diff);

    await postComment(`
### 🤖 AI Review for ${file.new_path}
${review}
`);
  }
})();