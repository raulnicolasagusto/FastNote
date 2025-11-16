# Final TenTap configuration
$filePath = "E:\programacion\trabajos\FastNote\app\note-detail.tsx"
$lines = Get-Content $filePath

$newLines = @()
$skipExtensions = $false

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]

    # Replace the import line
    if ($line -match "^import \{ RichText, Toolbar, useEditorBridge, type EditorBridge \} from '@10play/tentap-editor';") {
        $newLines += "import {"
        $newLines += "  RichText,"
        $newLines += "  Toolbar,"
        $newLines += "  useEditorBridge,"
        $newLines += "  type EditorBridge,"
        $newLines += "  CoreBridge,"
        $newLines += "  BoldBridge,"
        $newLines += "  HeadingBridge,"
        $newLines += "  HighlightBridge,"
        $newLines += "  BulletListBridge,"
        $newLines += "  HistoryBridge,"
        $newLines += "  PlaceholderBridge,"
        $newLines += "} from '@10play/tentap-editor';"
        continue
    }

    # Replace editor configuration
    if ($line -match "// TenTap editor for rich text content \(editable\)") {
        $newLines += "  // TenTap editor for rich text content (editable)"
        $newLines += "  const editor = useEditorBridge({"
        $newLines += "    autofocus: false,"
        $newLines += "    avoidIosKeyboard: true,"
        $newLines += "    bridgeExtensions: ["
        $newLines += "      CoreBridge.configureExtension(),"
        $newLines += "      BoldBridge.configureExtension(),"
        $newLines += "      HeadingBridge.configureExtension({ levels: [1, 2, 3] }),"
        $newLines += "      HighlightBridge.configureExtension(),"
        $newLines += "      BulletListBridge.configureExtension(),"
        $newLines += "      HistoryBridge.configureExtension(),"
        $newLines += "      PlaceholderBridge.configureExtension({ placeholder: 'Start writing...' }),"
        $newLines += "    ],"
        $newLines += "  });"
        $newLines += ""
        # Skip old editor config until we hit viewEditor
        $skipExtensions = $true
        continue
    }

    # Replace viewEditor configuration
    if ($line -match "// TenTap editor for viewing \(read-only\)") {
        $skipExtensions = $false
        $newLines += "  // TenTap editor for viewing (read-only)"
        $newLines += "  const viewEditor = useEditorBridge({"
        $newLines += "    autofocus: false,"
        $newLines += "    editable: false,"
        $newLines += "    bridgeExtensions: ["
        $newLines += "      CoreBridge.configureExtension(),"
        $newLines += "      BoldBridge.configureExtension(),"
        $newLines += "      HeadingBridge.configureExtension({ levels: [1, 2, 3] }),"
        $newLines += "      HighlightBridge.configureExtension(),"
        $newLines += "      BulletListBridge.configureExtension(),"
        $newLines += "    ],"
        $newLines += "  });"
        # Skip until next meaningful line
        $i += 5  # Skip the old config lines
        continue
    }

    if (!$skipExtensions) {
        $newLines += $line
    }
}

$newLines | Set-Content $filePath
Write-Host "Configuración final aplicada: $($newLines.Count) líneas"
