# PowerShell script to build js/products-data.js from raw parts
$p1 = Get-Content -Raw -Path "data\raw_p1.json" | ConvertFrom-Json
$p2 = Get-Content -Raw -Path "data\raw_p2.json" | ConvertFrom-Json
$p3 = Get-Content -Raw -Path "data\raw_p3.json" | ConvertFrom-Json
$p4 = Get-Content -Raw -Path "data\raw_p4.json" | ConvertFrom-Json

$all = @()
$all += $p1
$all += $p2
$all += $p3
$all += $p4

Write-Output "Total raw items loaded: $($all.Count)"

function GenerateOverview($item) {
    $cat = $item.cat
    $name = $item.name
    $act = $item.active
    $con = $item.concern
    
    if ($cat -eq "Celebrity Range") {
        return "An ultra-premium formulation designed for intense red-carpet luminosity and cellular rejuvenation. Powered by $act, it penetrates deeply to target $con while restoring skin elasticity and an unmatched youthful glow."
    } elseif ($cat -eq "Soaps") {
        return "Handcrafted cold-processed luxury therapeutic soap enriched with $act. Gently lifts dirt, sebum, and impurities without stripping vital moisture, specifically addressing $con for visibly softer, healthier skin."
    } elseif ($cat -like "*Hair Oil*") {
        return "Pure non-greasy non-fragrance botanical elixir cold-pressed with $act. Infuses the scalp with micro-nutrients and essential fatty acids to combat $con, reinforcing the follicular base from root to tip."
    } elseif ($cat -eq "Shampoo") {
        return "Sulfate-free dermatological cleansing shampoo formulated with active bio-extracts of $act. Clarifies the scalp and hair shafts while treating $con, leaving locks resilient, silky, and naturally voluminous."
    } elseif ($cat -eq "Hair Conditioner") {
        return "Intensive moisture-lock hair conditioner blended with $act. Seals cuticles, eliminates tangles, and shields strands against $con to deliver salon-grade softness, shine, and manageability."
    } elseif ($cat -like "*Face Serum*") {
        return "High-potency micro-molecular serum concentrated with $act. Delivers targeted cellular delivery to effectively treat $con, refine skin texture, and restore youthful elasticity."
    } elseif ($cat -eq "Face Cream") {
        return "Velvety dermal barrier restorative cream enriched with $act. Provides 24-hour hydration, cellular repair, and defense against $con for a supple, refined, radiant complexion."
    } elseif ($cat -eq "Face Wash") {
        return "Gentle pH-balanced dermal cleanser infused with $act. Purifies pores, clears environmental impurities, and targets $con without causing tightness or barrier disruption."
    } elseif ($cat -like "*Hair Serum*") {
        return "Lightweight, non-sticky hair and scalp treatment powered by $act. Rapidly absorbs into hair cuticles and follicles to combat $con and impart a brilliant, healthy shine."
    } elseif ($cat -like "*Hair Gel*") {
        return "Nutrient-rich styling gel formulated with natural botanical extracts of $act. Delivers clean, flake-free hold while nourishing the scalp and addressing $con."
    } elseif ($cat -eq "Face Gel") {
        return "Ultra-refreshing, oil-free cooling gel packed with $act. Delivers weightless hydration and soothing active compounds directly to irritated skin to relieve $con."
    } elseif ($cat -eq "Body Lotion") {
        return "Deeply nourishing all-over body hydrator infused with $act. Restores the cutaneous moisture barrier, treats $con, and leaves skin touchably soft and luminous."
    } elseif ($cat -eq "Face Pack") {
        return "Detoxifying and refining botanical clay mask rich in $act. Draws out deep-seated micro-pollutants and sebum, treating $con while infusing vital trace minerals."
    } elseif ($cat -like "*Scrub*") {
        return "Gentle micro-exfoliating polish formulated with fine biodegradable granules and $act. Sloughs off dull, dead keratinized cells to resolve $con and reveal polished skin."
    } elseif ($cat -like "*Lip*") {
        return "Nutrient-dense lip therapy enriched with $act and organic emollients. Deeply softens chapped lips, targets $con, and seals in moisture with a plush, satin finish."
    } elseif ($cat -like "*Bath Salt*") {
        return "Therapeutic mineral bath soak combining pure mineral salts and $act. Eases muscular tension, detoxifies skin pores, and relieves $con during relaxing bath rituals."
    } elseif ($cat -like "*Hair Butter*") {
        return "Ultra-rich conditioning hair butter crafted with raw plant butters and $act. Intensely seals cuticles, tames stubborn frizz, and addresses $con."
    } else {
        return "Specialized targeted formulation featuring $act. Expertly crafted to relieve $con, strengthen cellular resilience, and promote healthy skin and hair balance."
    }
}

function GenerateIngredients($item) {
    $base = @()
    $act = $item.active
    $acts = $act.Split(@('&', ','), [System.StringSplitOptions]::RemoveEmptyEntries)
    foreach ($a in $acts) {
        $base += $a.Trim()
    }
    
    $cat = $item.cat
    if ($cat -eq "Soaps") {
        $base += @("Cold Pressed Virgin Coconut Oil", "Pure Castor Oil", "Plant Glycerin", "Vitamin E (Tocopherol)", "Lye (Saponified Base)")
    } elseif ($cat -like "*Hair Oil*") {
        $base += @("Cold-Pressed Sesame Seed Oil", "Sweet Almond Oil", "Golden Jojoba Oil", "Natural Tocopherol (Vitamin E)")
    } elseif ($cat -like "*Shampoo*" -or $cat -eq "Face Wash") {
        $base += @("Aqua (Purified Water)", "Sodium Lauroyl Sarcosinate (Mild Coconut Surfactant)", "Coco Glucoside", "Vegetable Glycerin", "Pro-Vitamin B5 (Panthenol)", "Potassium Sorbate")
    } elseif ($cat -like "*Face Serum*") {
        $base += @("Purified Aqua / Aloe Hydrosol", "Sodium Hyaluronate", "Vegetable Glycerin", "Allantoin", "Ethylhexylglycerin")
    } elseif ($cat -like "*Face Cream*" -or $cat -like "*Body Lotion*") {
        $base += @("Aqua (Water)", "Cetearyl Olivate & Sorbitan Olivate (Olive-derived)", "Cold-Pressed Jojoba Seed Oil", "Caprylic/Capric Triglyceride", "Shea Butter Extract", "Sodium Hyaluronate")
    } elseif ($cat -like "*Lip*") {
        $base += @("Unrefined Shea Butter", "Cold-Pressed Almond Oil", "Beeswax / Candelilla Wax", "Castor Seed Oil", "Natural Vitamin E")
    } else {
        $base += @("Aqua (Purified Demineralized Water)", "Aloe Barbadensis Leaf Extract", "Vegetable Glycerin", "Tocopheryl Acetate", "Phenoxyethanol (Gentle Preservative)")
    }
    
    # Return unique array of max 8 ingredients
    $unique = $base | Select-Object -Unique | Select-Object -First 8
    return $unique
}

function GenerateStarFeatures($item) {
    $cat = $item.cat
    $feats = @()
    
    if ($item.aroma -like "*Unscented*") {
        $feats += "100% Fragrance-Free"
    } else {
        $feats += "Natural Essential Oil Aroma"
    }
    
    if ($cat -eq "Celebrity Range") {
        $feats += "Clinically Proven Actives"
        $feats += "Red-Carpet Glow Formula"
        $feats += "Pharma-Grade L-Glutathione"
    } elseif ($cat -eq "Soaps") {
        $feats += "Cold-Processed & Sulphate-Free"
        $feats += "Zero Artificial Hardening Agents"
        $feats += "Skin Barrier Protective pH"
    } elseif ($cat -like "*Hair Oil*") {
        $feats += "Non-Sticky Micro-Absorption"
        $feats += "Pure Cold-Pressed Herbals"
        $feats += "Zero Mineral Oil & Liquid Paraffin"
    } elseif ($cat -eq "Shampoo" -or $cat -eq "Hair Conditioner") {
        $feats += "Sulfate & Silicone Free"
        $feats += "Safe for Color-Treated Hair"
        $feats += "Bio-Enzyme Cuticle Lock"
    } elseif ($cat -like "*Face Serum*") {
        $feats += "High-Concentration Bio-Actives"
        $feats += "Fast-Penetrating Nano Delivery"
        $feats += "Non-Comedogenic & Oil-Free Feel"
    } else {
        $feats += "100% Ayurvedic Bio-Actives"
        $feats += "Dermatologically Tested"
        $feats += "Paraben & Cruelty Free"
    }
    return $feats | Select-Object -First 4
}

$processed = @()

foreach ($item in $all) {
    $id = $item.id
    $overview = GenerateOverview $item
    $ingredients = GenerateIngredients $item
    $starFeatures = GenerateStarFeatures $item
    
    $obj = [ordered]@{
        id = $id
        name = $item.name
        category = $item.cat
        weight = $item.wt
        price = $item.pr
        image = "assets/images/products/product_$id.webp"
        packaging = $item.pkg
        concern = $item.concern
        skinType = $item.skin
        aroma = $item.aroma
        keyActive = $item.active
        overview = $overview
        ingredients = $ingredients
        starFeatures = $starFeatures
        certificates = @(
            "ISO 9001:2015",
            "US FDA Registered Facility",
            "WHO-GMP Certified",
            "FSSAI Certified"
        )
    }
    $processed += $obj
}

$jsonOutput = ($processed | ConvertTo-Json -Depth 6).Replace("\u0026", "&")

$jsContent = @"
/**
 * ZBM Product Database
 * Total Products: $($processed.Count)
 * Categories: 32
 * Certifications: ISO 9001:2015, US FDA Registered, WHO-GMP Certified, FSSAI Certified
 * Packaging Branding: 'Logo here' placeholder on all containers
 */

const ZBM_PRODUCTS = $jsonOutput;

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ZBM_PRODUCTS };
}
"@

[System.IO.File]::WriteAllText("js\products-data.js", $jsContent, [System.Text.Encoding]::UTF8)
Write-Output "Successfully generated js\products-data.js with $($processed.Count) products!"
