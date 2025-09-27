import { Asset } from 'expo-asset';

/**
 * Loads the SVG template from assets
 */
export async function loadSVGTemplate(): Promise<string> {
  try {
    // Load the SVG file as an asset
    const asset = Asset.fromModule(require('../assets/exportedNote.svg'));
    
    // Download the asset if it hasn't been downloaded yet
    if (!asset.downloaded) {
      await asset.downloadAsync();
    }
    
    // Fetch the content of the SVG file
    const response = await fetch(asset.uri);
    const svgContent = await response.text();
    
    return svgContent;
  } catch (error) {
    console.error('Error loading SVG template:', error);
    throw new Error('Failed to load SVG template');
  }
}