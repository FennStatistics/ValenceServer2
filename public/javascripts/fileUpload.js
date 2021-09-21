FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    stylePanelAspectRatio: 150/100, // set aspect ratio (defined pixels picture input)
    imageResizeTargetWidth: 100, // set maximum width and height
    imageResizeTargetHeight: 150
})


FilePond.parse(document.body);