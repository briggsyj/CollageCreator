# Quickstart: checking PDF export

1. `npm test` runs `tests/pdf.test.ts`: the writer's structure, page sizes for A4 and a screen size, offsets, and a many-page file.
2. `npm run test:e2e -- e2e/pdf.spec.ts` saves a PDF, a book PDF, one page's PDF, and checks the hidden choice for an Instagram post and the tools.
3. By hand: make a collage, choose PDF under Save, save, open the file in a browser and a desktop reader; for A4 check it prints at 297 × 210 mm without scaling.
4. Privacy: the existing no-network test passes with a PDF saved.
