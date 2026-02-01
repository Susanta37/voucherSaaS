<?php

namespace App\Services;

use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Renderer\Image\SvgImageBackEnd; 
use BaconQrCode\Writer;

class QRCodeService
{
    /**
     * We go back to SVG for the generator because it's more compatible 
     * across different PHP environments without requiring imagick.
     */
    public static function generateSvg(string $text, int $size = 300): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle($size),
            new SvgImageBackEnd()
        );

        return (new Writer($renderer))->writeString($text);
    }
}