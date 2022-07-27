FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
);

FilePond.setOptions({
  stylePanelAspectRatio: 9 / 16,
  imageResizeTargetWidth: 480,
  imageResizeTargetHeight: 270
})

FilePond.parse(document.body);
W