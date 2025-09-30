<!-- \\src\views\Readme.vue -->
<template>
  <div class="page">
    <div class="page-container">
      <div class="page-info">
        <div class="page-info-subtitle subtitle">Диалоги для жизни</div>
        <div class="page-info-title title">Финский с AI</div>
        <div class="page-info-text text">
          Создавайте персонализированные диалоги на финском, указывая уровень, тему и ключевые слова. Приложение — ваш
          личный наставник, который предлагает четыре уникальных режима тренировок: от простого ознакомления с текстом
          до отработки произношения и навыков перевода. Получайте мгновенную обратную связь, подробный грамматический и
          лексический анализ, адаптированный под ваш уровень.
        </div>
        <router-link
          to="/auth"
          class="btn blue"
        >
          <span class="material-symbols-outlined icon">account_circle</span>
          Начать
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
  width: 100%;
  text-align: right;
}
.page-info-title {
  margin: 3rem 0;
  text-align: center;
}
.page-info-text {
  margin: 2rem 0;
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
  .page-info-text {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}
</style>
