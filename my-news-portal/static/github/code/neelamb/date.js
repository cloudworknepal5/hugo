<script type='text/javascript'>
// AD to BS Converter logic (सरलीकृत)
function convertToNepaliDate(adDate) {
    var date = new Date(adDate);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    // data
    // base
    var bsYear = year + 56;
    var bsMonth = month + 8;
    if (bsMonth > 12) { bsMonth -= 12; bsYear += 1; }
    
    var nepaliMonths = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
    var nepaliDigits = ['०','१','२','३','४','५','६','७','८','९'];

    function toNepaliNum(num) {
        return num.toString().split('').map(d => nepaliDigits[d] || d).join('');
    }

    return toNepaliNum(day) + " " + nepaliMonths[bsMonth-1] + " " + toNepaliNum(bsYear);
}
</script>