/**
 * WCAG アクセシビリティ自動チェック
 *
 * axe-core/playwright を使い、各主要ページの WCAG 適合性を検査する。
 * 検出された violations はアノテーションとレポートに記録するが、テスト失敗にしない。
 * 今後の改善: 将来的には violations をゼロにすることを目標とする。
 */
import AxeBuilder from "@axe-core/playwright";
import { test } from "@playwright/test";

const targetPages = ["/", "/hobbies", "/hobbies/running", "/activity", "/report"];

for (const pagePath of targetPages) {
  test(`${pagePath} の WCAG アクセシビリティ（未達成は今後の改善）`, async ({
    page
  }, testInfo) => {
    await page.goto(pagePath);

    const results = await new AxeBuilder({ page }).analyze();

    const { violations, passes, incomplete, inapplicable } = results;

    // 結果サマリーをアノテーションで見える化
    testInfo.annotations.push({
      type: "axe-summary",
      description: `passes: ${passes.length}, violations: ${violations.length}, incomplete: ${incomplete.length}, inapplicable: ${inapplicable.length}`
    });

    if (violations.length > 0) {
      for (const violation of violations) {
        testInfo.annotations.push({
          type: "axe-violation",
          description: `[今後の改善] [${violation.impact ?? "unknown"}] ${violation.id}: ${violation.description} (影響ノード数: ${violation.nodes.length})`
        });
      }

      console.warn(
        `[accessibility] ${pagePath}: ${violations.length} 件の violations を検出（今後の改善対象）`
      );
      for (const violation of violations) {
        console.warn(
          `  [${violation.impact ?? "unknown"}] ${violation.id}: ${violation.description}`
        );
        for (const node of violation.nodes) {
          console.warn(`    - ${node.html}`);
        }
      }
    } else {
      console.log(`[accessibility] ${pagePath}: violations なし`);
    }

    // 現時点の violations はエラーとしない。将来的にゼロを目標とする。
  });
}
