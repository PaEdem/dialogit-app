<template>
  <div class="page">
    <div class="page-container">
      <div class="page-info">
        <h2 class="page-info-subtitle">Диалоги для жизни</h2>
        <h1 class="page-info-title">Учи финский с AI</h1>
        <p class="page-info-description">
          Создавайте персонализированные диалоги на финском, указывая уровень, тему и ключевые слова. Приложение — ваш
          личный наставник, который предлагает четыре уникальных режима тренировок: от простого ознакомления с текстом
          до отработки произношения и навыков перевода. Получайте мгновенную обратную связь, подробный грамматический и
          лексический анализ, адаптированный под ваш уровень.
        </p>
        <router-link
          to="/auth"
          class="btn blue"
        >
          <span class="material-symbols-outlined icon">account_circle</span>
          Kirjaudu sisään
        </router-link>
      </div>
      <div class="page-image">
        <img
          class="image"
          src="../assets/wordcloud.png"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  width: 100%;
  padding: 0 10%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--pink);
}
.page-container {
  position: relative;
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
}
.page-info {
  position: relative;
  width: 45%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 0;
}
.page-info-subtitle {
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 3px;
  font-size: 1rem;
  width: 100%;
  text-align: right;
  text-transform: uppercase;
  color: var(--title);
  font-weight: 700;
}
.page-info-title {
  font-family: 'Open Sans', sans-serif;
  font-size: 3rem;
  line-height: 3rem;
  margin: 3rem 0;
  letter-spacing: 3px;
  font-weight: 700;
  color: var(--heading);
  text-align: center;
}
.page-info-description {
  font-family: 'Open Sans', sans-serif;
  font-style: italic;
  margin: 2rem 0;
  font-size: 1.25rem;
  line-height: 2rem;
  color: var(--subtitle);
  text-align: center;
}
.page-image {
  width: 55%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  margin-left: 2rem;
}
.image {
  width: 100%;
  height: auto;
  object-fit: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
@media (max-width: 1920px) {
  .page-container {
    width: 80%;
  }
}
@media (max-width: 1440px) {
  .page-container {
    width: 90%;
  }
  .page-info-title {
    font-size: 2rem;
    line-height: 2rem;
  }
  .page-info-description {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}
</style>
