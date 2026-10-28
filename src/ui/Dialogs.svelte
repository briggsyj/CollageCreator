<!-- SPDX-License-Identifier: GPL-2.0-or-later -->
<!-- Copyright (C) 2026 John Briggs -->
<script lang="ts">
  import { app, type DialogName } from "./app-state.svelte";
  import { tr } from "./tr.svelte";

  let progress: HTMLDialogElement;
  let help: HTMLDialogElement;
  let about: HTMLDialogElement;

  /** Open the dialog that app.dialog names and close the others. */
  $effect(() => {
    const shown: Record<DialogName, HTMLDialogElement> = { progress, help, about };
    for (const name of Object.keys(shown) as DialogName[]) {
      const dialog = shown[name];
      if (app.dialog === name && !dialog.open) dialog.showModal();
      else if (app.dialog !== name && dialog.open) dialog.close();
    }
  });

  const closed = (name: DialogName) => () => {
    if (app.dialog === name) app.dialog = null;
  };
</script>

<dialog
  id="progress-dialog"
  aria-labelledby="progress-title"
  bind:this={progress}
  oncancel={(e) => e.preventDefault()}
>
  <h2 id="progress-title">{tr("Please wait")}</h2>
  <p>{tr("Performing image computation...")}</p>
  <progress id="progress" max="100" value={app.progress}></progress>
  <div class="button-row">
    <button type="button" id="cancel" onclick={() => app.cancelExport()}>{tr("Cancel")}</button>
  </div>
</dialog>

<dialog id="help-dialog" aria-labelledby="help-title" bind:this={help} onclose={closed("help")}>
  <h2 id="help-title">{tr("Help")}</h2>
  <h3>{tr("Moving around")}</h3>
  <ul class="help-list">
    <li>
      <strong>{tr("Pan")}</strong>:
      <span>{tr("drag the collage to move it. Hold Space to pan from any tool.")}</span>
    </li>
    <li>
      <strong>{tr("Zoom")}</strong>:
      <span>{tr("scroll over the collage, or use + and − at the top right. Fit shows it all.")}</span>
    </li>
  </ul>
  <h3>{tr("Changing photos")}</h3>
  <ul class="help-list">
    <li>
      <strong>{tr("Swap")}</strong>:
      <span>{tr("click a photo, then another, to swap them.")}</span>
    </li>
    <li>
      <strong>{tr("Select")}</strong>:
      <span
        >{tr("click a photo to select it in the Photos step, then make it wider or taller.")}</span
      >
    </li>
    <li>
      <strong>{tr("Crop")}</strong>:
      <span
        >{tr("select a photo, press Crop, then drag it and zoom to choose which part shows.")}</span
      >
    </li>
    <li>
      <strong>{tr("Book")}</strong>:
      <span
        >{tr("press Add page under the collage for more pages in a row, each saved as its own image. Swap works between pages.")}</span
      >
    </li>
  </ul>
  <p class="hint help-note">
    {tr("Everything runs in your browser. Your photos are never uploaded.")}
  </p>
  <div class="button-row">
    <button type="button" id="help-close" class="primary" onclick={() => (app.dialog = null)}>
      {tr("Close")}
    </button>
  </div>
</dialog>

<dialog id="about-dialog" aria-labelledby="about-title" bind:this={about} onclose={closed("about")}>
  <h2 id="about-title">{tr("About")}</h2>
  <p>
    <strong>Collage Creator</strong>
    <span>{tr("is an independent, modified web version of")}</span>
    <a href="https://github.com/adrienverge/PhotoCollage" rel="noopener">PhotoCollage</a>,
    Copyright © 2013–2014 Adrien Vergé, with translations by the contributors credited in the
    NOTICE. It is not the original and is not endorsed by its authors.
  </p>
  <p>
    The changes and additions in this version are Copyright © 2026 John Briggs. It is released under
    the <a href="./LICENSE.txt" rel="noopener">GNU General Public License</a>, version 2 or (at
    your option) any later version (SPDX: GPL-2.0-or-later).
  </p>
  <p>
    {tr(
      "This program comes with ABSOLUTELY NO WARRANTY; without even the implied warranty of merchantability or fitness for a particular purpose.",
    )}
  </p>
  <p>
    <span>{tr("Your photos never leave your device.")}</span>
    <a href="https://github.com/briggsyj/CollageCreator" rel="noopener">{tr("Source code")}</a>
    ·
    <a href="./NOTICE.txt" rel="noopener">NOTICE</a>
    ·
    <a href="./THIRD-PARTY-LICENSES.txt" rel="noopener">Third-party licences</a>
  </p>
  <div class="button-row">
    <button type="button" id="about-close" class="primary" onclick={() => (app.dialog = null)}>
      {tr("Close")}
    </button>
  </div>
</dialog>
