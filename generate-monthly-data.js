// Generate monthly historical data (2015-2018) from the 2018 baseline data
// This creates realistic monthly time-series data for better forecasting

const fs = require('fs');

// Read the original 2018 data
const data2018 = {
  "headers": ["acc_code", "cpyname", "country", "territory", "year", "revenue"],
  "types": ["string", "string", "string", "string", "integer", "number"],
  "rows": [["457970","Universal Concept sprl","Belgium","Benelux",2018,292866],["992558","WALDEN FARMS KORNELIA WARDA-PONIECKA","Poland","Eastern Europe",2018,59154],["992778","Stonemanor","Belgium","Benelux",2018,851565],["993199","Lengo Group - KMY","Albania","Eastern Europe",2018,131599],["992966","SnackCrate, Inc.","United States of America","North America",2018,768479],["425257","PARKnSHOP A Division of PARKnSHOP (HK)","Hong Kong","East Asia",2018,804003],["992617","Y International (UK) Ltd","United Kingdom","GB/Ireland",2018,688438],["457532","Wonderfood SPRL","Belgium","Benelux",2018,197579],["457763","Overseas Imports SL - Mijas","Spain","Iberia",2018,500995],["992722","RedMart Private  Ltd","Singapore","South-East Asia",2018,2712169],["992103","Overseas Imports SL - Benidorm","Spain","Iberia",2018,90087],["993201","Overseas Imports SL - Portimao","Portugal","Iberia",2018,142669],["992011","Overseas Imports SL - Javea","Spain","Iberia",2018,207397],["992255","Scotts Limited","Malta","Eastern Mediterranean",2018,738826],["992398","Splendour Planet Lda","Portugal","Iberia",2018,244350],["993114","City Super Shanghai Trading Limited","China","East Asia",2018,28466],["993223","D.Watson Chemists","Pakistan","South Asia",2018,30059],["992565","Village Supermarket Ltd","Tanzania","Anglophone Africa",2018,129509],["425084","Taste of America","Spain","Iberia",2018,97538],["425373","British Delights Ltd","United States of America","North America",2018,84727],["992951","Cereal Hunters SL EU","Spain","Iberia",2018,43361],["992701","Ciberom Vigo sl","Spain","Iberia",2018,55711],["457639","Supermercado Costablanca SL","Spain","Iberia",2018,48176],["993230","Musgrave España, S.A.","Spain","Iberia",2018,58193],["992752","Costa del Sol Balear Euro","Spain","Iberia",2018,34495],["457794","Apolonia Supermercados S.A.","Portugal","Iberia",2018,1084085],["993197","Hurrykeep Ltd T/A Geoffrey's of London","France","France & Italy",2018,165574],["457620","Petticoat Lane","France","France & Italy",2018,3801],["993183","International Grand Mart Supermarket -","United Arab Emirates","Middle East",2018,107061],["992507","SIA RSKORPIONS","Latvia","Eastern Europe",2018,128543],["457782","White Island Corner Shop","Spain","Iberia",2018,6210],["457531","British Food Imports / Sonrah Co","United States of America","North America",2018,48439],["425094","Broken English","Germany","Central Europe",2018,29261],["993268","The Link EU","Germany","Central Europe",2018,130286],["457784","MEIDI-YA SINGAPORE CO (PTE) LTD","Singapore","South-East Asia",2018,333768],["457540","Temooljee & Co Ltd","Seychelles","Anglophone Africa",2018,140120],["992677","Normal A/S","Denmark","Scandinavia",2018,617036],["992192","Smart Product Co.,Ltd","Thailand","South-East Asia",2018,402197],["457946","Roma Fruits of Nature","Nigeria","Anglophone Africa",2018,4677],["425432","Kirk Supermarket Ltd","Cayman Islands","Caribbean",2018,327502],["425169","Scottish Loft","Canada","North America",2018,13937],["993216","Ackroyd's Scottish Bakery","United States of America","North America",2018,26824],["992021","J Delgado t/a Socas Distribuciones","Canary Islands","Atlantic Islands",2018,26086],["992669","The British Food Depot LLC","United States of America","North America",2018,178765],["993282","LETS GmbH","Germany","Central Europe",2018,34751],["457767","Oluf Lorentzen AS","Norway","Scandinavia",2018,68521],["992454","Tindale & Stanton","Spain","Iberia",2018,29664],["457521","Brittains Home Stores","France","France & Italy",2018,46497],["993142","Q&K ConfiserieEU","France","France & Italy",2018,16020],["992776","Yata Limited","Hong Kong","East Asia",2018,134978],["992568","Pall Center","Luxembourg","Benelux",2018,6329],["993116","Little Britain","Germany","Central Europe",2018,1512],["992728","Carlos Rivero X1688240V","Spain","Iberia",2018,21263],["P332-7976","Easyuk International Ltd","China","East Asia",2018,0],["993302","Conworxx GmbH","Germany","Central Europe",2018,1672],["457726","BritShop GmbH","Switzerland","Central Europe",2018,192806],["992977","Brands Solution  Ltd","United Kingdom","GB/Ireland",2018,63929],["993292","AYK Trading Ltd","United Kingdom","GB/Ireland",2018,123838],["993240","Overseas Imports SL Wholesale","Canary Islands","Atlantic Islands",2018,118741],["457523","Shanghai City Food Distribution Co Ltd","China","East Asia",2018,45111],["992986","Sensationlicious Unipessoal Lda EU","Portugal","Iberia",2018,34949],["992960","Goedert Remich","Luxembourg","Benelux",2018,6661],["993219","David Jones Pty Limited","Australia","Oceania/Pacific",2018,13357],["425197","John Szewczuk GmbH *** DO NOT USE ***","Austria","Central Europe",2018,83243],["992448","Sobeys Capital Inc.","Canada","North America",2018,112589],["992978","Al Meera Markets SAOC","Oman","Middle East",2018,53903],["992768","City Gourmet Sdn Bhd","Malaysia","South-East Asia",2018,62085],["993348","Slik Brothers Bleiswijk BV","Netherlands","Benelux",2018,13855],["993334","TFP Retail Sdn Bhd","Malaysia","South-East Asia",2018,421438],["993344","zea retail sl - MALAGA EU","Spain","Iberia",2018,49839],["992284","SUPERMERCADOS VIP COMERCIO IMPORT","Portugal","Iberia",2018,67150],["425497","Interpole Imp-Exp ***DO NOT USE***","France","France & Italy",2018,14815],["993326","SIA Gemoss","Latvia","Eastern Europe",2018,101302],["993343","American Candy Corner ***DO NOT USE***","Italy","France & Italy",2018,2743],["992762","Rudolf Ammersin GesmbH","Austria","Central Europe",2018,2947],["993176","FLEMINGO ENTERPRIZES FZCO","United Arab Emirates","Middle East",2018,13932],["993396","Landshandilin","Faroe Islands","Scandinavia",2018,51476],["992151","B&S Global Food Purchase B.V.","Netherlands","Benelux",2018,2538],["992546","Kennedy (UK) Ltd","France","France & Italy",2018,7336],["992834","Stepadis TA Super U VILLEBOIS LAVALETTE","France","France & Italy",2018,10294],["992586","Dega S.R.L.","Italy","France & Italy",2018,12268],["992945","Candy Time Pty Ltd","Australia","Oceania/Pacific",2018,136765],["992915","Shah United T/A Bonfect","Australia","Oceania/Pacific",2018,203829]]
};

// Seasonal patterns for different months (multipliers relative to average)
const seasonalPattern = [
  0.85,  // Jan - post-holiday slowdown
  0.88,  // Feb
  0.95,  // Mar
  1.00,  // Apr
  1.05,  // May
  1.08,  // Jun
  1.10,  // Jul - summer peak
  1.12,  // Aug - summer peak
  1.05,  // Sep
  1.08,  // Oct
  1.15,  // Nov - holiday build-up
  1.20   // Dec - holiday peak
];

// Generate monthly historical data with realistic patterns
function generateMonthlyData(partialYear = true) {
  const allRows = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  data2018.rows.forEach(row => {
    const [acc_code, cpyname, country, territory, year, revenue2018] = row;

    // Skip companies with zero revenue
    if (revenue2018 === 0) return;

    // Random growth rate for this company (between 5% and 15% annually)
    const baseGrowthRate = 0.08 + Math.random() * 0.07;

    // Monthly growth rate
    const monthlyGrowthRate = Math.pow(1 + baseGrowthRate, 1/12) - 1;

    // Random starting year (some companies started later)
    const startYear = 2015 + Math.floor(Math.random() * 3); // Start between 2015-2017

    // Calculate base monthly revenue (working backwards from 2018 total)
    const totalSeasonalFactor = seasonalPattern.reduce((a, b) => a + b, 0);
    const baseMonthlyRevenue = revenue2018 / totalSeasonalFactor;

    let monthCounter = 0;

    for (let y = startYear; y <= 2018; y++) {
      // Determine how many months to generate for this year
      let maxMonth = 12;

      // If it's 2018 and partialYear is true, only generate through August (8 months)
      if (y === 2018 && partialYear) {
        maxMonth = 8; // Jan-Aug (partial year)
      }

      for (let m = 0; m < maxMonth; m++) {
        // Calculate revenue with:
        // 1. Base monthly revenue
        // 2. Seasonal adjustment
        // 3. Growth factor (from start)
        // 4. Random noise

        const yearsFromStart = (y - startYear) + (m / 12);
        const growthFactor = Math.pow(1 + baseGrowthRate, yearsFromStart);

        const seasonalFactor = seasonalPattern[m];
        const noise = 0.85 + Math.random() * 0.30; // ±15% variation

        const monthlyRevenue = Math.round(
          baseMonthlyRevenue * seasonalFactor * growthFactor * noise
        );

        // Create year-month string (e.g., "2018-08" for August 2018)
        const yearMonth = `${y}-${String(m + 1).padStart(2, '0')}`;
        const monthName = `${months[m]} ${y}`;

        allRows.push([
          acc_code,
          cpyname,
          country,
          territory,
          yearMonth,
          monthName,
          y,  // year
          m + 1,  // month number
          monthlyRevenue
        ]);

        monthCounter++;
      }
    }
  });

  return {
    headers: ["acc_code", "cpyname", "country", "territory", "year_month", "month_name", "year", "month", "revenue"],
    types: ["string", "string", "string", "string", "string", "string", "integer", "integer", "number"],
    rows: allRows.sort((a, b) => {
      // Sort by year_month, then territory, then company
      if (a[4] !== b[4]) return a[4].localeCompare(b[4]);
      if (a[3] !== b[3]) return a[3].localeCompare(b[3]);
      return a[1].localeCompare(b[1]);
    })
  };
}

// Generate with partial 2018 (through August)
const monthlyData = generateMonthlyData(true);

fs.writeFileSync('monthly-data.json', JSON.stringify(monthlyData, null, 2));
console.log(`Generated ${monthlyData.rows.length} rows of monthly data`);
console.log('Data spans: 2015-01 through 2018-08 (partial year)');
console.log('Data saved to monthly-data.json');

// Calculate some stats
const uniqueMonths = new Set(monthlyData.rows.map(r => r[4]));
console.log(`Total unique months: ${uniqueMonths.size}`);
console.log('Last month in dataset:', Array.from(uniqueMonths).sort().pop());
