# Creates a clean rounded HondaAccord icon.
param(
  [string]$Dest = "app-icon.png",
  [int]$Size = 1024
)

Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap $Size, $Size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

function New-RoundedRectPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

$bg = [System.Drawing.Color]::FromArgb(255, 225, 6, 0)
$red = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)
$darkRed = [System.Drawing.Color]::FromArgb(255, 166, 0, 0)

$radius = [Math]::Round($Size * 0.22)
$roundedRect = New-RoundedRectPath 0 0 $Size $Size $radius
$g.FillPath((New-Object System.Drawing.SolidBrush $bg), $roundedRect)
$g.SetClip($roundedRect)

# Darker accent stripe for depth without adding black corners.
$accent = New-Object System.Drawing.Drawing2D.GraphicsPath
$accent.AddPolygon(@(
  (New-Object System.Drawing.PointF 0, 730),
  (New-Object System.Drawing.PointF 1024, 555),
  (New-Object System.Drawing.PointF 1024, 1024),
  (New-Object System.Drawing.PointF 0, 1024)
))
$g.FillPath((New-Object System.Drawing.SolidBrush $darkRed), $accent)

$brush = New-Object System.Drawing.SolidBrush $red

# Motion lines, kept inside the rounded square so no black/transparent boxes appear around the mark.
$lineHeight = [Math]::Round($Size * 0.045)
$lineX = [Math]::Round($Size * 0.16)
$lineYs = @(330, 400, 470, 540, 610)
$lineWidths = @(255, 220, 185, 220, 255)
for ($i = 0; $i -lt $lineYs.Count; $i++) {
  $y = [Math]::Round($Size * ($lineYs[$i] / 1024))
  $w = [Math]::Round($Size * ($lineWidths[$i] / 1024))
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddPolygon(@(
    (New-Object System.Drawing.PointF ($lineX + 35), $y),
    (New-Object System.Drawing.PointF ($lineX + $w), $y),
    (New-Object System.Drawing.PointF ($lineX + $w - 26), ($y + $lineHeight)),
    (New-Object System.Drawing.PointF $lineX, ($y + $lineHeight))
  ))
  $g.FillPath($brush, $path)
}

# Stylized italic H as three parallelograms.
function Fill-Poly($points) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddPolygon($points)
  $g.FillPath($brush, $path)
}

Fill-Poly @(
  (New-Object System.Drawing.PointF 405, 250),
  (New-Object System.Drawing.PointF 545, 250),
  (New-Object System.Drawing.PointF 475, 780),
  (New-Object System.Drawing.PointF 335, 780)
)
Fill-Poly @(
  (New-Object System.Drawing.PointF 655, 250),
  (New-Object System.Drawing.PointF 795, 250),
  (New-Object System.Drawing.PointF 725, 780),
  (New-Object System.Drawing.PointF 585, 780)
)
Fill-Poly @(
  (New-Object System.Drawing.PointF 430, 462),
  (New-Object System.Drawing.PointF 735, 462),
  (New-Object System.Drawing.PointF 715, 588),
  (New-Object System.Drawing.PointF 410, 588)
)

$bmp.Save($Dest, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Saved $Dest ($Size x $Size)"
