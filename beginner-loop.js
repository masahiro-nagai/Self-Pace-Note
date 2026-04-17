const STORAGE_KEY = "beginner-loop-v1";
const CLOUD_ENDPOINTS = {
  challenge: "/api/challenge",
  review: "/api/weekly-review"
};
const REFLECTIVE_STATUSES = new Set(["done", "grounded", "retreated"]);
const RESTORE_STATUSES = new Set(["grounded", "retreated"]);

const CATEGORY_META = {
  question: {
    label: "素直に聞く",
    purpose: "分かったふりをやめて、学習速度を上げる"
  },
  draft: {
    label: "未完成を見せる",
    purpose: "完成前に出す耐性をつける"
  },
  feedback: {
    label: "フィードバックを取る",
    purpose: "自己流の盲点を早く見つける"
  },
  public: {
    label: "人前で初心者になる",
    purpose: "周囲の目より成長を優先する"
  },
  experiment: {
    label: "新しい型を試す",
    purpose: "いつもの安全運転から半歩出る"
  }
};

const LOCAL_CHALLENGES = {
  question: [
    {
      title: "ひとつだけ初歩の質問をする",
      text: "今日のどこかで、分かったふりをやめて初歩の質問をひとつだけ口に出す。",
      steps: [
        "曖昧なまま進めている点をひとつ選ぶ",
        "『初歩的で恐縮ですが』を前置きにして質問する",
        "答えを聞いたあと、理解が進んだ点を一言返す"
      ],
      win: "質問できたら達成",
      shameBase: 3
    },
    {
      title: "知らない前提をその場で確認する",
      text: "会話の流れを止めてもよいので、前提知識の抜けを一度だけ確認する。",
      steps: [
        "分からない単語や背景をひとつ見つける",
        "『前提だけ確認したいです』と切り出す",
        "確認後に自分の理解を短く言い直す"
      ],
      win: "確認のひと声を出せたら達成",
      shameBase: 4
    }
  ],
  draft: [
    {
      title: "60点のドラフトを先に見せる",
      text: "完成を待たず、途中の考えを誰か一人に見せて反応をもらう。",
      steps: [
        "いま作っているものの途中版をひとつ選ぶ",
        "『まだ荒いですが先に見てほしいです』と送る",
        "返ってきた反応を一行だけメモする"
      ],
      win: "未完成のまま見せられたら達成",
      shameBase: 5
    },
    {
      title: "考えかけの仮説を共有する",
      text: "答えが整っていなくても、途中の仮説を言葉にして出す。",
      steps: [
        "今の仮説を一文で書く",
        "『まだ仮説段階ですが』と前置きして共有する",
        "ズレていた点を次回の観察ポイントに変える"
      ],
      win: "仮説を外に出せたら達成",
      shameBase: 4
    }
  ],
  feedback: [
    {
      title: "改善点だけを聞きにいく",
      text: "褒め言葉ではなく、改善点をひとつだけ取りにいく。",
      steps: [
        "信頼できる相手を一人選ぶ",
        "『よかった点より直した方がいい点を一つください』と頼む",
        "受け取った内容を防御せずにメモする"
      ],
      win: "改善点を一つ受け取れたら達成",
      shameBase: 5
    },
    {
      title: "一番こわい観点でレビューを頼む",
      text: "避けたい論点ほど、あえて先に見てもらう。",
      steps: [
        "自分が突っ込まれたくない観点を選ぶ",
        "その観点を指定してレビューを依頼する",
        "返答に対して言い訳せず『助かる』で返す"
      ],
      win: "怖い観点で依頼できたら達成",
      shameBase: 6
    }
  ],
  public: [
    {
      title: "人前で初心者宣言をする",
      text: "うまくやれる人として振る舞う代わりに、今日は初心者として入る。",
      steps: [
        "入る場をひとつ選ぶ",
        "『ここは初心者なので学ばせてください』と先に言う",
        "ひとつだけ具体的な質問を添える"
      ],
      win: "初心者だと名乗れたら達成",
      shameBase: 6
    },
    {
      title: "知らないことを公開メモに残す",
      text: "理解できていない点と、次に調べることを短く公開する。",
      steps: [
        "分かっていない点を一つ選ぶ",
        "『今ここが分かっていない』と短く書く",
        "次に何を試すかを一行つける"
      ],
      win: "公開で未理解を認められたら達成",
      shameBase: 6
    }
  ],
  experiment: [
    {
      title: "いつもの型を一度だけ崩す",
      text: "安全なやり方を少し外して、新しい試し方を一回だけやってみる。",
      steps: [
        "いつもの進め方をひとつ書き出す",
        "あえて別のやり方をひとつ選ぶ",
        "結果の良し悪しより、感情の変化を記録する"
      ],
      win: "新しい型を一度試せたら達成",
      shameBase: 4
    },
    {
      title: "慣れていない場に5分だけ入る",
      text: "新しいコミュニティや文脈に、短時間だけ初心者として参加する。",
      steps: [
        "入りたいが後回しにしている場を選ぶ",
        "5分だけ参加する前提で入る",
        "終わったら『実害があったか』を確認する"
      ],
      win: "短時間でも入れたら達成",
      shameBase: 5
    }
  ]
};

const els = {
  focusArea: document.getElementById("focus-area"),
  socialContext: document.getElementById("social-context"),
  intensity: document.getElementById("intensity"),
  intensityLabel: document.getElementById("intensity-label"),
  apiUrl: document.getElementById("api-url"),
  categoryPills: [...document.querySelectorAll(".pill")],
  generatorStatus: document.getElementById("generator-status"),
  generateBtn: document.getElementById("generate-btn"),
  surpriseBtn: document.getElementById("surprise-btn"),
  challengeModeBadge: document.getElementById("challenge-mode-badge"),
  challengeDate: document.getElementById("challenge-date"),
  challengeTitle: document.getElementById("challenge-title"),
  challengeText: document.getElementById("challenge-text"),
  challengeShame: document.getElementById("challenge-shame"),
  challengePurpose: document.getElementById("challenge-purpose"),
  challengeWin: document.getElementById("challenge-win"),
  challengeCategory: document.getElementById("challenge-category"),
  challengeSteps: document.getElementById("challenge-steps"),
  heroFocusLabel: document.getElementById("hero-focus-label"),
  heroModeLabel: document.getElementById("hero-mode-label"),
  statusButtons: [...document.querySelectorAll(".segment")],
  fearBefore: document.getElementById("fear-before"),
  fearBeforeLabel: document.getElementById("fear-before-label"),
  reliefAfter: document.getElementById("relief-after"),
  reliefAfterLabel: document.getElementById("relief-after-label"),
  actionTaken: document.getElementById("action-taken"),
  actualOutcome: document.getElementById("actual-outcome"),
  learningNote: document.getElementById("learning-note"),
  saveLogBtn: document.getElementById("save-log-btn"),
  saveStatus: document.getElementById("save-status"),
  todaySummary: document.getElementById("today-summary"),
  todayStatusBadge: document.getElementById("today-status-badge"),
  cumulativeDays: document.getElementById("cumulative-days"),
  selfDelta: document.getElementById("self-delta"),
  restoreDays: document.getElementById("restore-days"),
  avgTrust: document.getElementById("avg-trust"),
  historyList: document.getElementById("history-list"),
  reviewBtn: document.getElementById("review-btn"),
  reviewOutput: document.getElementById("review-output")
};

const state = loadState();

function loadState() {
  const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
  const rawLogs = parsed?.logs ?? {};
  const logs = Object.fromEntries(
    Object.entries(rawLogs).map(([date, log]) => [
      date,
      {
        ...log,
        status: normalizeStatus(log?.status)
      }
    ])
  );
  return {
    settings: {
      focusArea: parsed?.settings?.focusArea ?? "",
      socialContext: parsed?.settings?.socialContext ?? "",
      intensity: parsed?.settings?.intensity ?? 3,
      categories: parsed?.settings?.categories?.length
        ? parsed.settings.categories
        : ["question", "draft"],
      apiUrl: parsed?.settings?.apiUrl ?? (window.BEGINNER_LOOP_API_BASE ?? "")
    },
    currentChallenge: parsed?.currentChallenge ?? null,
    logs
  };
}

function safeParse(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  return dateKeyFromDate(new Date());
}

function formatDate(dateString) {
  const date = parseDateKey(dateString);
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function dateKeyFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function normalizeStatus(status) {
  if (status === "deferred") {
    return "grounded";
  }
  if (status === "skipped") {
    return "retreated";
  }
  return ["planned", "done", "grounded", "retreated"].includes(status) ? status : "planned";
}

function intensityCopy(intensity) {
  const map = {
    1: "1 / 5: 準備運動レベル",
    2: "2 / 5: かなり安全",
    3: "3 / 5: 少しだけ心拍数が上がる",
    4: "4 / 5: 明確に勇気が要る",
    5: "5 / 5: しっかり初心者に戻る"
  };
  return map[intensity] ?? map[3];
}

function getSelectedCategories() {
  return els.categoryPills
    .filter((button) => button.classList.contains("is-active"))
    .map((button) => button.dataset.category);
}

function buildChallengeFromTemplate(template, category) {
  const intensity = Number(els.intensity.value);
  const focus = els.focusArea.value.trim();
  const context = els.socialContext.value.trim();
  const shame = clamp(template.shameBase + intensity - 3, 2, 8);
  const areaPhrase = focus ? `「${focus}」` : "いま伸ばしたいテーマ";
  const contextPhrase = context ? `場面は ${context}` : "場面は問いません";

  return {
    id: `local-${Date.now()}`,
    mode: "local",
    date: todayKey(),
    category,
    title: template.title,
    text: `${template.text} 今回の焦点は ${areaPhrase}、${contextPhrase} です。`,
    steps: template.steps,
    purpose: CATEGORY_META[category].purpose,
    shame,
    win: template.win
  };
}

function generateLocalChallenge(options = {}) {
  const categories = options.categories?.length ? options.categories : getSelectedCategories();
  const chosenCategory = pickRandom(categories);
  const template = pickRandom(LOCAL_CHALLENGES[chosenCategory]);
  return buildChallengeFromTemplate(template, chosenCategory);
}

function normalizeApiBase(url) {
  return url.trim().replace(/\/+$/, "");
}

async function requestCloudChallenge() {
  const apiBase = normalizeApiBase(els.apiUrl.value);
  if (!apiBase) {
    return null;
  }

  const payload = {
    date: todayKey(),
    focusArea: els.focusArea.value.trim(),
    socialContext: els.socialContext.value.trim(),
    intensity: Number(els.intensity.value),
    categories: getSelectedCategories(),
    recentLogs: recentLogs(5).map((log) => ({
      date: log.date,
      status: log.status,
      category: log.category,
      challengeTitle: log.challengeTitle,
      learning: log.learning
    }))
  };

  const response = await fetch(`${apiBase}${CLOUD_ENDPOINTS.challenge}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`challenge request failed: ${response.status}`);
  }

  const data = await response.json();
  return normalizeChallenge(data);
}

function normalizeChallenge(data) {
  const category = data.category && CATEGORY_META[data.category] ? data.category : "question";
  return {
    id: data.id ?? `cloud-${Date.now()}`,
    mode: "cloud",
    date: data.date ?? todayKey(),
    category,
    title: data.title ?? "今日の一歩",
    text: data.text ?? "今日の一歩を試してみましょう。",
    steps: Array.isArray(data.steps) && data.steps.length ? data.steps : ["ひとつ小さな行動を選ぶ"],
    purpose: data.purpose ?? CATEGORY_META[category].purpose,
    shame: clamp(Number(data.shame ?? 5), 1, 10),
    win: data.win ?? "実行できたら達成"
  };
}

function renderChallenge(challenge) {
  if (!challenge) {
    return;
  }

  state.currentChallenge = challenge;
  els.challengeModeBadge.textContent = challenge.mode === "cloud" ? "VERTEX" : "LOCAL";
  els.challengeDate.textContent = formatDate(challenge.date);
  els.challengeTitle.textContent = challenge.title;
  els.challengeText.textContent = challenge.text;
  els.challengeShame.textContent = `${challenge.shame} / 10`;
  els.challengePurpose.textContent = challenge.purpose;
  els.challengeWin.textContent = challenge.win;
  els.challengeCategory.textContent = CATEGORY_META[challenge.category].label;
  els.challengeSteps.innerHTML = challenge.steps
    .map((step) => `<li>${escapeHtml(String(step))}</li>`)
    .join("");
  els.heroFocusLabel.textContent = els.focusArea.value.trim() || CATEGORY_META[challenge.category].label;
  els.heroModeLabel.textContent = challenge.mode === "cloud" ? "Gemini Coach" : "Inner Coach";
  persist();
}

function statusLabel(status) {
  const map = {
    planned: "これから",
    done: "進めた",
    grounded: "整えた",
    retreated: "一歩引いた"
  };
  return map[normalizeStatus(status)] ?? map.planned;
}

function setStatus(status) {
  els.statusButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.status === normalizeStatus(status));
  });
}

function currentStatus() {
  const active = els.statusButtons.find((button) => button.classList.contains("is-active"))?.dataset.status;
  return normalizeStatus(active);
}

function bindSettings() {
  els.focusArea.value = state.settings.focusArea;
  els.socialContext.value = state.settings.socialContext;
  els.intensity.value = String(state.settings.intensity);
  els.apiUrl.value = state.settings.apiUrl;
  els.intensityLabel.textContent = intensityCopy(Number(els.intensity.value));
  els.heroFocusLabel.textContent = state.settings.focusArea || "今日の一歩";
  els.generatorStatus.textContent = state.settings.apiUrl
    ? "Cloud Run 連携が設定されています。失敗時はローカル生成に戻ります。"
    : "ローカル生成モードです。Cloud Run をつなぐと内省レビューが AI コーチ対応になります。";

  els.categoryPills.forEach((button) => {
    button.classList.toggle("is-active", state.settings.categories.includes(button.dataset.category));
  });

  const update = () => {
    state.settings.focusArea = els.focusArea.value.trim();
    state.settings.socialContext = els.socialContext.value.trim();
    state.settings.intensity = Number(els.intensity.value);
    state.settings.categories = getSelectedCategories();
    state.settings.apiUrl = els.apiUrl.value.trim();
    els.intensityLabel.textContent = intensityCopy(Number(els.intensity.value));
    els.generatorStatus.textContent = state.settings.apiUrl
      ? "Cloud Run 連携が設定されています。失敗時はローカル生成に戻ります。"
      : "ローカル生成モードです。Cloud Run をつなぐと内省レビューが AI コーチ対応になります。";
    els.heroFocusLabel.textContent = state.settings.focusArea || "今日の一歩";
    persist();
  };

  [els.focusArea, els.socialContext, els.intensity, els.apiUrl].forEach((element) => {
    element.addEventListener("input", update);
    element.addEventListener("change", update);
  });

  els.categoryPills.forEach((button) => {
    button.addEventListener("click", () => {
      const activeCount = getSelectedCategories().length;
      const isActive = button.classList.contains("is-active");
      if (isActive && activeCount === 1) {
        return;
      }
      button.classList.toggle("is-active");
      update();
    });
  });
}

function recentLogs(limit = 7) {
  return Object.entries(state.logs)
    .map(([date, log]) => ({ date, ...log, status: normalizeStatus(log.status) }))
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, limit);
}

function logsInWindow(days, offset = 0) {
  const cursor = parseDateKey(todayKey());
  cursor.setDate(cursor.getDate() - offset);
  const items = [];

  for (let index = 0; index < days; index += 1) {
    const key = dateKeyFromDate(cursor);
    const log = state.logs[key];
    if (log) {
      items.push({
        date: key,
        ...log,
        status: normalizeStatus(log.status)
      });
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  return items;
}

function isReflective(log) {
  return REFLECTIVE_STATUSES.has(normalizeStatus(log.status));
}

function isRestoreDay(log) {
  return RESTORE_STATUSES.has(normalizeStatus(log.status));
}

function formatDelta(days) {
  if (days > 0) {
    return `+${days}日`;
  }
  if (days < 0) {
    return `${days}日`;
  }
  return "±0日";
}

function setRangeLabels() {
  els.fearBeforeLabel.textContent = `${els.fearBefore.value} / 10`;
  els.reliefAfterLabel.textContent = `${els.reliefAfter.value} / 10`;
}

function fillTodayForm() {
  const log = state.logs[todayKey()];
  if (!log) {
    setStatus("planned");
    els.fearBefore.value = "5";
    els.reliefAfter.value = "6";
    els.actionTaken.value = "";
    els.actualOutcome.value = "";
    els.learningNote.value = "";
    setRangeLabels();
    return;
  }

  setStatus(log.status);
  els.fearBefore.value = String(log.fearBefore ?? 5);
  els.reliefAfter.value = String(log.reliefAfter ?? 6);
  els.actionTaken.value = log.actionTaken ?? "";
  els.actualOutcome.value = log.actualOutcome ?? "";
  els.learningNote.value = log.learning ?? "";
  setRangeLabels();
}

function renderTodaySummary() {
  const log = state.logs[todayKey()];
  const challenge = log?.challengeSnapshot ?? state.currentChallenge;
  const status = normalizeStatus(log?.status ?? "planned");

  els.todayStatusBadge.textContent = statusLabel(status);
  els.todayStatusBadge.className = `status-badge ${status}`;

  if (!challenge && !log) {
    els.todaySummary.innerHTML = "<p>まだ今日のログはありません。まずはひとつ、今日の自分に合う一歩を決めましょう。</p>";
    return;
  }

  const parts = [];
  if (challenge) {
    parts.push(`<p><strong>今日の一歩:</strong> ${escapeHtml(challenge.title)}</p>`);
    parts.push(`<p><strong>カテゴリ:</strong> ${escapeHtml(CATEGORY_META[challenge.category]?.label ?? "その他")}</p>`);
  }
  if (log?.actionTaken) {
    parts.push(`<p><strong>やったこと:</strong> ${escapeHtml(log.actionTaken)}</p>`);
  }
  if (log?.actualOutcome) {
    parts.push(`<p><strong>実際に起きたこと:</strong> ${escapeHtml(log.actualOutcome)}</p>`);
  }
  if (log?.learning) {
    parts.push(`<p><strong>前の自分との違い:</strong> ${escapeHtml(log.learning)}</p>`);
  }
  if (!parts.length) {
    parts.push("<p>今日のチャレンジは決まりました。進む日でも引く日でも、いまの自分に合う選択をしてみましょう。</p>");
  }

  els.todaySummary.innerHTML = parts.join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderStats() {
  const allReflectiveLogs = Object.values(state.logs).filter(isReflective);
  const currentWeek = logsInWindow(7).filter(isReflective);
  const previousWeek = logsInWindow(7, 7).filter(isReflective);
  const restoreDays = currentWeek.filter(isRestoreDay).length;
  const avgTrust = currentWeek.length
    ? Math.round(currentWeek.reduce((sum, log) => sum + Number(log.reliefAfter || 0), 0) / currentWeek.length)
    : 0;
  const selfDelta = currentWeek.length - previousWeek.length;

  els.cumulativeDays.textContent = `${allReflectiveLogs.length}日`;
  els.selfDelta.textContent = formatDelta(selfDelta);
  els.restoreDays.textContent = `${restoreDays}日`;
  els.avgTrust.textContent = `${avgTrust} / 10`;
}

function renderHistory() {
  const items = recentLogs(7);
  if (!items.length) {
    els.historyList.innerHTML = "<p>まだ履歴がありません。最初の1レップを積んでみましょう。</p>";
    return;
  }

  els.historyList.innerHTML = items
    .map((log) => {
      const status = normalizeStatus(log.status ?? "planned");
      const title = log.challengeTitle ?? log.challengeSnapshot?.title ?? "未設定";
      const outcome = log.learning || log.actualOutcome || "まだメモなし";
      return `
        <article class="history-item">
          <div class="history-copy">
            <strong>${formatDate(log.date)}</strong>
            <p>${escapeHtml(title)}</p>
            <p>${escapeHtml(outcome)}</p>
          </div>
          <span class="status-badge ${status}">${statusLabel(status)}</span>
        </article>
      `;
    })
    .join("");
}

function categoryCounts(logs) {
  return logs.reduce((counts, log) => {
    const category = log.category ?? "question";
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
}

function buildLocalReview() {
  const currentWeek = logsInWindow(7).filter(isReflective);
  const previousWeek = logsInWindow(7, 7).filter(isReflective);
  if (!currentWeek.length) {
    return [
      "今週はまだ比較できるだけの記録がありません。",
      "まずは前進でも後退でもいいので、今日の自分を一度そのまま残してみるのがおすすめです。"
    ];
  }

  const counts = categoryCounts(currentWeek);
  const strongestCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "question";
  const avgFear = Math.round(currentWeek.reduce((sum, log) => sum + Number(log.fearBefore || 0), 0) / currentWeek.length);
  const avgTrust = Math.round(currentWeek.reduce((sum, log) => sum + Number(log.reliefAfter || 0), 0) / currentWeek.length);
  const forwardDays = currentWeek.filter((log) => normalizeStatus(log.status) === "done").length;
  const restoreDays = currentWeek.filter(isRestoreDay).length;
  const selfDelta = currentWeek.length - previousWeek.length;
  const mostRecent = currentWeek[0];
  const recentDifference = mostRecent.learning || "前の自分よりも少し正直に選べた";

  return [
    `今週は ${currentWeek.length} 日、自分の状態を記録できています。進めた日は ${forwardDays} 日、整えたり一歩引いた日は ${restoreDays} 日でした。`,
    `前の 7 日との自分比は ${formatDelta(selfDelta)} です。いちばん多かった型は「${CATEGORY_META[strongestCategory].label}」で、やる前の抵抗感は平均 ${avgFear} / 10、終わった後の自己信頼は平均 ${avgTrust} / 10 でした。`,
    `いちばん新しい自分比メモは「${recentDifference}」です。増えていても減っていても、他人ではなく自分の歩幅を見られていることが大切です。`
  ];
}

async function buildCloudReview() {
  const apiBase = normalizeApiBase(els.apiUrl.value);
  if (!apiBase) {
    return null;
  }

  const response = await fetch(`${apiBase}${CLOUD_ENDPOINTS.review}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      date: todayKey(),
      logs: recentLogs(7)
    })
  });

  if (!response.ok) {
    throw new Error(`review request failed: ${response.status}`);
  }

  const data = await response.json();
  if (Array.isArray(data.paragraphs) && data.paragraphs.length) {
    return data.paragraphs;
  }
  if (typeof data.summary === "string" && data.summary.trim()) {
    return [data.summary.trim()];
  }
  return null;
}

function renderReview(paragraphs, source = "local") {
  const badge = source === "cloud" ? "AI Coach" : "Self Review";
  els.reviewOutput.innerHTML = `
    <p><strong>${badge}</strong></p>
    ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
  `;
}

async function generateChallenge() {
  els.generateBtn.disabled = true;
  els.generatorStatus.textContent = "今日の一歩を組み立てています...";

  try {
    const cloudChallenge = await requestCloudChallenge();
    if (cloudChallenge) {
      renderChallenge(cloudChallenge);
      els.generatorStatus.textContent = "Gemini を使って、今日の自分に合うチャレンジを生成しました。";
      return;
    }
  } catch (error) {
    els.generatorStatus.textContent = "Cloud Run の呼び出しに失敗したので、ローカル生成に切り替えました。";
  } finally {
    els.generateBtn.disabled = false;
  }

  const localChallenge = generateLocalChallenge();
  renderChallenge(localChallenge);
  els.generatorStatus.textContent = "ローカルのチャレンジを生成しました。";
}

function randomizeControls() {
  const availableCategories = Object.keys(CATEGORY_META);
  const chosen = availableCategories.filter(() => Math.random() > 0.5);
  const finalCategories = chosen.length ? chosen : ["question", "draft"];

  els.categoryPills.forEach((button) => {
    button.classList.toggle("is-active", finalCategories.includes(button.dataset.category));
  });

  els.intensity.value = String(Math.floor(Math.random() * 5) + 1);
  els.intensityLabel.textContent = intensityCopy(Number(els.intensity.value));
  state.settings.categories = finalCategories;
  state.settings.intensity = Number(els.intensity.value);
  persist();
}

function saveTodayLog() {
  const challenge = state.currentChallenge ?? generateLocalChallenge();
  const key = todayKey();
  const entry = {
    status: currentStatus(),
    fearBefore: Number(els.fearBefore.value),
    reliefAfter: Number(els.reliefAfter.value),
    actionTaken: els.actionTaken.value.trim(),
    actualOutcome: els.actualOutcome.value.trim(),
    learning: els.learningNote.value.trim(),
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    category: challenge.category,
    challengeSnapshot: challenge,
    savedAt: new Date().toISOString()
  };

  state.logs[key] = entry;
  persist();
  els.saveStatus.textContent = `${formatDate(key)} の歩幅を保存しました。`;
  renderTodaySummary();
  renderStats();
  renderHistory();
}

function bindActions() {
  els.statusButtons.forEach((button) => {
    button.addEventListener("click", () => setStatus(button.dataset.status));
  });

  [els.fearBefore, els.reliefAfter].forEach((input) => {
    input.addEventListener("input", setRangeLabels);
  });

  els.generateBtn.addEventListener("click", generateChallenge);
  els.surpriseBtn.addEventListener("click", () => {
    randomizeControls();
    generateChallenge();
  });
  els.saveLogBtn.addEventListener("click", saveTodayLog);
  els.reviewBtn.addEventListener("click", async () => {
    els.reviewBtn.disabled = true;
    try {
      const cloudReview = await buildCloudReview();
      if (cloudReview) {
        renderReview(cloudReview, "cloud");
      } else {
        renderReview(buildLocalReview(), "local");
      }
    } catch (error) {
      renderReview(buildLocalReview(), "local");
    } finally {
      els.reviewBtn.disabled = false;
    }
  });
}

function hydrate() {
  bindSettings();
  bindActions();
  setRangeLabels();
  fillTodayForm();
  if (state.currentChallenge) {
    renderChallenge(state.currentChallenge);
  } else {
    renderChallenge(generateLocalChallenge({ categories: state.settings.categories }));
  }
  renderTodaySummary();
  renderStats();
  renderHistory();
  renderReview(buildLocalReview(), "local");
}

hydrate();
