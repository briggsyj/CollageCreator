# Tool contract

All tools return a ToolResult (see [data-model.md](../data-model.md)). `PhotoRef` = `{ page, position }`. Tools marked ✱ ask the person first and return `status: "waiting"`. Names are the registered names.

## Read

| Tool              | Input    | Does                               |
| ----------------- | -------- | ---------------------------------- |
| get_state         | none     | returns the StateReport            |
| get_photo_preview | PhotoRef | returns a small image of the photo |

## Photos and selection

| Tool                | Input                                                         | Same as                    |
| ------------------- | ------------------------------------------------------------- | -------------------------- |
| set_tool            | mode: `select` or `swap` or `pan`                             | Select, Swap and Pan tools |
| select_photos       | photos: PhotoRef[], add?: boolean                             | click / Shift-click        |
| clear_selection     | none                                                          | click on empty space       |
| swap_photos         | a: PhotoRef, b: PhotoRef                                      | Swap tool                  |
| resize_photo        | photos: PhotoRef[], change: `wider` or `taller` or `reset`    | Wider, Taller, Reset size  |
| crop_photo          | photo: PhotoRef, zoom?: number, pan?: {x, y}, reset?: boolean | Crop                       |
| remove_photos ✱     | photos: PhotoRef[]                                            | Remove                     |
| remove_all_photos ✱ | none                                                          | Remove all                 |
| undo_remove         | none                                                          | Undo remove                |
| move_photos_to_page | photos: PhotoRef[], page                                      | Move to page               |

## Pages

| Tool                    | Input                              | Same as                       |
| ----------------------- | ---------------------------------- | ----------------------------- |
| add_page                | none                               | + Add page                    |
| remove_page ✱           | page                               | Remove page                   |
| move_page               | page, direction: `left` or `right` | Move left / right             |
| set_page_count          | count 1 to 20                      | Pages                         |
| shuffle_layout ✱        | none                               | Shuffle layout (within pages) |
| shuffle_between_pages ✱ | none                               | Shuffle all between pages     |

## Layout and style

| Tool        | Input                                                   | Same as                                |
| ----------- | ------------------------------------------------------- | -------------------------------------- |
| set_layout  | style: `mosaic` or `gallery`                            | Layout cards                           |
| set_columns | columns: integer or `auto`                              | Columns                                |
| set_seed    | seed: integer                                           | address seed                           |
| set_border  | percent?: 0 to 100, color?: CSS colour, outer?: boolean | Border thickness, colour, outer border |
| set_corners | style: `none` or `slight` or `rounded`                  | Corners                                |

## Size and shape

| Tool               | Input                           | Same as                   |
| ------------------ | ------------------------------- | ------------------------- |
| set_output_size    | named?: id, or width and height | size buttons, custom size |
| set_orientation    | portrait: boolean               | Turn                      |
| set_instagram_post | images: 2 to 20, side?: pixels  | Instagram post            |

## View, language, help

| Tool         | Input                                          | Same as       |
| ------------ | ---------------------------------------------- | ------------- |
| open_tab     | tab: `photos` or `poster` or `style` or `save` | tabs          |
| zoom_view    | percent? or factor?, fit?: boolean             | zoom controls |
| pan_view     | dx, dy                                         | Pan           |
| set_language | code                                           | language menu |
| open_dialog  | name: `help` or `about`                        | Help, About   |
| close_dialog | none                                           | Close         |

## Saving

| Tool            | Input                                       | Same as                       |
| --------------- | ------------------------------------------- | ----------------------------- |
| set_save_format | format: `png` or `jpeg`, quality?: 1 to 100 | format and quality            |
| save            | page?: number                               | Save, Save page               |
| cancel_save     | none                                        | Cancel in the progress dialog |

## Not tools

Adding photos (the native file chooser, spec FR-009); answering a confirmation (the person's choice); theme (no control, follows the system).
