import { test, expect } from '@playwright/test'

test('1. Google Search', async ({ page }) => {
	// 1. Тест должен переходить на google.com
	await page.goto('https://google.com/')
	page.waitForLoadState()

	// 2. Тест должен вводить в поле поиска "Автотесты"
	const searchInput = page.locator('textarea[name="q"]')
	await searchInput.fill('Автотесты')

	// 3. Тест должен нажимать кнопку "Поиск в Google"
	// текст "Поиск в Google" может меняться в зависимости от языка
	const searchBtn = page.locator('input[role="button"]')
	await searchBtn.first().click()

	// 4. Проверка, что произошел переход на страницу результатов
	await page.waitForLoadState()
	expect(page.url()).toContain('search')

	// 5. Проверка наличия логотипа
	const logoElement = page.locator('div.logo > a#logo')
	await expect(logoElement).toBeVisible()
	// Проверка наличия SVG внутри логотипа
	const svgElement = logoElement.locator('svg')
	await expect(svgElement).toBeVisible()

	// 6. Проверка количества результатов поиска на первой странице
	const results = page.locator('div.g') // Локатор для блока с результатом
	const resultsCount = await results.count()
	expect(resultsCount).toBeGreaterThan(0)

	// 7. Проверка что есть пагинация
	const pages = page.locator('a[aria-label^="Page"]')
	const pagesCount = await pages.count()
	expect(pagesCount).toBeGreaterThan(0)

	// 8. Тест должен проверять наличие кнопки "Очистить"
	const clearBtn = page.locator(
		'div[jscontroller][jsname="RP0xob"] div[role="button"]:has(span):has(path)'
	)
	await expect(clearBtn).toBeVisible()

	// 9. Тест должен нажимать кнопку "Очистить" и проверять очищение строки поиска
	await clearBtn.click()
	await expect(searchInput).toBeVisible()
})
