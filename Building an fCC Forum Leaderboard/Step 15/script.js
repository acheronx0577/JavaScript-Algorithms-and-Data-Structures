const forumLatest = "https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json";
const forumTopicUrl = "https://forum.freecodecamp.org/t/";
const forumCategoryUrl = "https://forum.freecodecamp.org/c/";
const avatarUrl = "https://sea1.discourse-cdn.com/freecodecamp";

const postsContainer = document.getElementById("posts-container");

const fetchData = async () => {
  try {
    const res = await fetch(forumLatest);
    const data = await res.json();
    showLatestPosts(data);
  } catch (err) {
    console.log(err);
  }
};

fetchData();

const showLatestPosts = (data) => {
  const { topic_list, users } = data;
  const { topics } = topic_list;
postsContainer.innerHTML = topics.map((item) => {
    const {
        id,
        title,
        views,
        posts_count,
        slug,
        posters,
        category_id,
        bumped_at
    } = item;
    
    return `
        <div class="topic" data-id="${id}">
            <h3>${title}</h3>
            <div class="stats">
                <span>Views: ${views}</span>
                <span>Posts: ${posts_count}</span>
            </div>
            <div class="meta">
                <span>Slug: ${slug}</span>
                <span>Category: ${category_id}</span>
                <span>Last bumped: ${new Date(bumped_at).toLocaleDateString()}</span>
            </div>
        </div>
    `;
}).join('');
};