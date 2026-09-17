$p1 = Get-Content -Raw -Path "data\raw_p1.json" | ConvertFrom-Json
$p2 = Get-Content -Raw -Path "data\raw_p2.json" | ConvertFrom-Json
$p3 = Get-Content -Raw -Path "data\raw_p3.json" | ConvertFrom-Json
$p4 = Get-Content -Raw -Path "data\raw_p4.json" | ConvertFrom-Json

$all = @()
$all += $p1
$all += $p2
$all += $p3
$all += $p4

Write-Output "Loaded $($all.Count) items."

function CalculateUsdPricing($inrPrice, $category) {
    # Determine base USD sample price (Tier 1: 1 unit)
    $usdSample = 14.00
    if ($category -eq "Celebrity Range") {
        if ($inrPrice -gt 2000) { $usdSample = 38.00 }
        elseif ($inrPrice -gt 800) { $usdSample = 24.00 }
        else { $usdSample = 18.00 }
    } elseif ($category -eq "Soaps") {
        if ($inrPrice -ge 130) { $usdSample = 8.50 }
        else { $usdSample = 7.00 }
    } elseif ($category -like "*Face Serum*") {
        $usdSample = 18.00
    } elseif ($category -eq "Face Cream") {
        $usdSample = 17.50
    } elseif ($category -like "*Hair Serum*") {
        $usdSample = 16.50
    } elseif ($category -like "*Hair Oil*") {
        $usdSample = 15.00
    } elseif ($category -eq "Shampoo" -or $category -eq "Hair Conditioner") {
        $usdSample = 15.50
    } elseif ($category -eq "Face Wash" -or $category -like "*Cleanser*") {
        $usdSample = 13.50
    } elseif ($category -eq "Face Gel" -or $category -like "*Face Pack*") {
        $usdSample = 14.50
    } elseif ($category -eq "Body Lotion") {
        if ($inrPrice -ge 700) { $usdSample = 22.00 }
        else { $usdSample = 16.00 }
    } elseif ($category -like "*Lip*") {
        $usdSample = 9.50
    } elseif ($category -like "*Bath Salt*" -or $category -like "*Body Scrub*") {
        $usdSample = 14.00
    } else {
        if ($inrPrice -le 100) { $usdSample = 6.00 }
        elseif ($inrPrice -le 300) { $usdSample = 11.00 }
        elseif ($inrPrice -le 500) { $usdSample = 15.00 }
        else { $usdSample = 19.00 }
    }

    # Tiered bulk discounts:
    # Tier 1: 1 unit (Sample / Dropship) -> 0% discount
    # Tier 2: 50 units (Startup launch) -> 20% discount (Approved by user!)
    # Tier 3: 250 units (Retail / Spas) -> 35% discount
    # Tier 4: 500+ units (Wholesale) -> 50% discount
    # Tier 5: 1000+ units (Enterprise Private Label) -> 65% discount

    $t1 = [math]::Round($usdSample, 2)
    $t2 = [math]::Round($usdSample * 0.80, 2)
    $t3 = [math]::Round($usdSample * 0.65, 2)
    $t4 = [math]::Round($usdSample * 0.50, 2)
    $t5 = [math]::Round($usdSample * 0.35, 2)

    # MSRP suggested retail price: typically 2.6x to 3.2x sample unit cost
    $msrp = [math]::Round($usdSample * 2.8, 0)
    if ($msrp % 2 -eq 0) { $msrp -= 1 } # e.g. $39, $49, $79

    return @{
        sample = $t1
        t50 = $t2
        t250 = $t3
        t500 = $t4
        t1000 = $t5
        msrp = $msrp
    }
}

function GetPackagingInfo($category, $name) {
    $cat = $category.ToLower()
    $n = $name.ToLower()
    
    if ($cat -match "serum" -or $n -match "serum" -or $cat -match "eye care" -or $cat -match "lip care") {
        return @{
            type = "dropper"
            image = "assets/images/mockups/dropper.jpg"
            material = "Frosted Flint Glass Bottle with Matte White Pipette & Brushed Gold Collar"
            closure = "Precision Glass Pipette Dropper (0.5ml draw)"
            labelDimensions = "1.75 in x 3.5 in (45 x 89 mm)"
        }
    } elseif ($cat -match "wash" -or $cat -match "scrub" -or $cat -match "cleanser" -or $n -match "cleanser" -or $cat -match "foot care") {
        return @{
            type = "tube"
            image = "assets/images/mockups/tube.jpg"
            material = "Bio-Based Soft-Touch Matte PCR Squeeze Tube"
            closure = "Ergonomic Matte Fliptop Dispenser Cap"
            labelDimensions = "2.25 in x 4.0 in (57 x 102 mm)"
        }
    } elseif ($cat -match "soap" -or $cat -match "bath salt" -or $cat -match "body scrub") {
        return @{
            type = "soap"
            image = "assets/images/mockups/soap.jpg"
            material = "Cold-Processed Botanical Block / Textured Recycled Paper Band"
            closure = "Zero-Waste FSC-Certified Uncoated Belly Band"
            labelDimensions = "1.5 in x 7.0 in (38 x 178 mm)"
        }
    } elseif ($cat -match "lotion" -or $cat -match "shampoo" -or $cat -match "conditioner" -or $cat -match "hair oil" -or $n -match "lotion" -or $n -match "spray") {
        return @{
            type = "pump"
            image = "assets/images/mockups/pump.jpg"
            material = "Frosted Amber Recyclable Bottle with High-Viscosity Pump"
            closure = "Lockable Matte Charcoal & Gold Dispenser Pump"
            labelDimensions = "3.0 in x 5.5 in (76 x 140 mm)"
        }
    } else {
        return @{
            type = "jar"
            image = "assets/images/mockups/jar.jpg"
            material = "Heavy-Wall Frosted Glass Jar with Brushed Champagne Gold Lid"
            closure = "Airtight Polypropylene Sealing Disc with Metallic Cap"
            labelDimensions = "1.25 in x 6.5 in (32 x 165 mm)"
        }
    }
}

function GenerateOverviewText($item) {
    $cat = $item.cat
    $act = $item.active
    $con = $item.concern
    if ($cat -eq "Celebrity Range") {
        return "An ultra-premium clinical formulation engineered for intense red-carpet luminosity and cellular renewal. Powered by $act, it penetrates deeply to treat $con while restoring dermal elasticity and high-wattage radiance."
    } elseif ($cat -eq "Soaps") {
        return "Artisanal cold-processed therapeutic cleansing bar infused with $act. Gently purifies pores without disrupting the acid mantle, specifically addressing $con for silky, balanced skin."
    } elseif ($cat -like "*Hair Oil*") {
        return "Zero-fragrance botanical follicular elixir enriched with $act. Nourishes hair roots and micro-circulation to combat $con, reinforcing strand density from follicle to tip."
    } elseif ($cat -eq "Shampoo") {
        return "Sulfate-free dermatological clarifying wash formulated with concentrated bio-extracts of $act. Purifies sebum build-up and addresses $con while preserving moisture balance."
    } elseif ($cat -eq "Hair Conditioner") {
        return "Intense peptide and lipid conditioning emulsion blended with $act. Smooths cuticle scales, seals moisture, and defends against $con for salon-grade softness."
    } elseif ($cat -like "*Face Serum*") {
        return "Micro-molecular high-potency dermal serum packed with bio-active $act. Delivers targeted cellular repair to treat $con, refine skin texture, and restore youthful resilience."
    } elseif ($cat -eq "Face Cream") {
        return "Velvety dermal barrier replenishment cream fortified with $act. Delivers 24-hour hydration, barrier defense, and visible correction for $con."
    } elseif ($cat -eq "Face Wash") {
        return "pH-optimized balancing facial cleanser infused with $act. Gently sweeps away airborne pollutants and excess sebum, addressing $con without barrier disruption."
    } else {
        return "Dermatologist-developed private label formulation powered by $act. Formulated to combat $con, enhance barrier integrity, and leave skin and hair vibrant."
    }
}

function GenerateFullIngredients($item) {
    $base = @()
    $act = $item.active
    $acts = $act.Split(@('&', ','), [System.StringSplitOptions]::RemoveEmptyEntries)
    foreach ($a in $acts) {
        $base += $a.Trim()
    }
    
    $cat = $item.cat
    if ($cat -eq "Soaps") {
        $base += @("Organic Virgin Coconut Oil", "Pure Castor Seed Oil", "Plant Glycerin", "Tocopheryl Acetate (Vitamin E)", "Botanical Chlorophyll", "Saponified Olive Fatty Acids")
    } elseif ($cat -like "*Hair Oil*") {
        $base += @("Cold-Pressed Golden Jojoba Oil", "Sweet Almond Oil", "Cold-Pressed Sesame Seed Oil", "Tocopheryl Acetate (Vitamin E)", "Rosemary Leaf Extract")
    } elseif ($cat -like "*Shampoo*" -or $cat -eq "Face Wash") {
        $base += @("Deionized Aqua", "Sodium Lauroyl Sarcosinate (Coconut Surfactant)", "Coco-Glucoside", "Vegetable Glycerin", "Panthenol (Pro-Vitamin B5)", "Potassium Sorbate", "Citric Acid")
    } elseif ($cat -like "*Face Serum*") {
        $base += @("Deionized Aqua / Aloe Barbadensis Hydrosol", "Sodium Hyaluronate (Multi-Molecular)", "Vegetable Glycerin", "Allantoin", "Ethylhexylglycerin", "Ferulic Acid")
    } elseif ($cat -like "*Face Cream*" -or $cat -like "*Body Lotion*") {
        $base += @("Deionized Aqua", "Cetearyl Olivate & Sorbitan Olivate", "Cold-Pressed Jojoba Seed Oil", "Caprylic/Capric Triglyceride", "Butyrospermum Parkii (Shea) Butter", "Sodium Hyaluronate")
    } else {
        $base += @("Deionized Aqua", "Aloe Barbadensis Leaf Juice", "Vegetable Glycerin", "Tocopheryl Acetate", "Centella Asiatica Extract", "Gentle Phenoxyethanol")
    }
    
    return ($base | Select-Object -Unique | Select-Object -First 8)
}

function GenerateFullStarFeatures($item) {
    $feats = @()
    if ($item.aroma -like "*Unscented*") {
        $feats += "100% Fragrance-Free (Hypoallergenic)"
    } else {
        $feats += "Natural Essential Oil Aroma"
    }
    
    if ($item.cat -eq "Celebrity Range") {
        $feats += "Red-Carpet Glow Matrix"
        $feats += "Pharma-Grade L-Glutathione / Actives"
        $feats += "Ultra-Concentrated Cellular Formula"
    } elseif ($item.cat -like "*Serum*") {
        $feats += "Multi-Molecular Active Delivery"
        $feats += "Instant Absorption & Weightless Finish"
        $feats += "Clinically Proven Actives"
    } elseif ($item.cat -like "*Soap*") {
        $feats += "Cold-Processed & Aged 45 Days"
        $feats += "Rich Velvety Lather"
        $feats += "Zero Palm Oil & Zero Harsh Detergents"
    } elseif ($item.cat -like "*Cream*") {
        $feats += "Biomimetic Lipid Barrier Repair"
        $feats += "Non-Comedogenic & Breathable"
        $feats += "72-Hour Moisture-Lock Complex"
    } else {
        $feats += "Efficacy Tested & Dermatologist Grade"
        $feats += "Clean USA Compliant Formulation"
        $feats += "Sustainable Biodegradable Base"
    }
    return ($feats | Select-Object -First 4)
}

$finalList = @()

foreach ($it in $all) {
    $pricing = CalculateUsdPricing $it.price $it.cat
    $pkg = GetPackagingInfo $it.cat $it.name
    $overview = GenerateOverviewText $it
    $ingredients = GenerateFullIngredients $it
    $stars = GenerateFullStarFeatures $it

    $prod = [ordered]@{
        id = [int]$it.id
        name = [string]$it.name
        category = [string]$it.cat
        weight = [string]$it.weight
        inrPrice = [int]$it.price
        usdPrice = $pricing.sample
        pricing = [ordered]@{
            sample = $pricing.sample
            tier1_qty = "1 pc (Sample / Dropship)"
            tier1_price = $pricing.sample
            tier2_qty = "50 pcs (Startup Launch)"
            tier2_price = $pricing.t50
            tier2_discount = "20% OFF"
            tier3_qty = "250 pcs (Brand Stock)"
            tier3_price = $pricing.t250
            tier3_discount = "35% OFF"
            tier4_qty = "500+ pcs (Wholesale)"
            tier4_price = $pricing.t500
            tier4_discount = "50% OFF"
            tier5_qty = "1,000+ pcs (Enterprise)"
            tier5_price = $pricing.t1000
            tier5_discount = "65% OFF"
            msrp = $pricing.msrp
            margin = "$([math]::Round((($pricing.msrp - $pricing.t50) / $pricing.msrp) * 100))%"
        }
        image = $pkg.image
        packaging = $pkg.type
        packagingSpecs = [ordered]@{
            material = $pkg.material
            closure = $pkg.closure
            labelDimensions = $pkg.labelDimensions
            leadTime = "2-3 Weeks (Turnkey USA)"
            shelfLife = "24 Months"
            labelPlaceholder = "Logo Here (Centered Minimal Modern)"
        }
        concern = [string]$it.concern
        skinType = [string]$it.skinType
        aroma = [string]$it.aroma
        keyActive = [string]$it.active
        overview = $overview
        ingredients = $ingredients
        starFeatures = $stars
        certificates = @("ISO 9001:2015", "US FDA Registered Facility", "WHO-GMP Certified", "FSSAI Certified")
    }

    $finalList += $prod
}

$json = $finalList | ConvertTo-Json -Depth 6
$jsContent = "/**`n * High-End B2B White-Label Cosmetics Master Product Database`n * Inspired by selfnamed.com | Anti-Gravity Design Collection`n * Total Products: $($finalList.Count)`n * Turnkey USA Private Label Ready • Tiered MOQ (1 to 1,000+ pcs)`n */`n`nconst ZBM_PRODUCTS = $json;`n`nif (typeof module !== 'undefined' && module.exports) {`n  module.exports = ZBM_PRODUCTS;`n}"

[System.IO.File]::WriteAllText("C:\Users\Admin\.gemini\antigravity\scratch\zbm-catalogue\js\products-data.js", $jsContent, [System.Text.Encoding]::UTF8)

Write-Output "Successfully updated products-data.js with $($finalList.Count) products in USD."
