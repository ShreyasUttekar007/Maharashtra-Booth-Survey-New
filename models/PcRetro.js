const mongoose = require("mongoose");

const surveySchemaRetro = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    pc: {
      type: String,
      required: [true, "PC is required"],
      trim: true,
    },
    constituencyName: {
      type: String,
      required: [true, "Constituency Name is required"],
      trim: true,
    },
    constituencyNumber: {
      type: Number,
      required: [true, "Constituency Number is required"],
    },
    Booth: {
      type: String,
      required: [true, "Booth is required"],
      trim: true,
    },
    shs: {
      type: Number,
      default: null,
    },
    bjp: {
      type: Number,
      default: null,
    },
    ncp: {
      type: Number,
      default: null,
    },
    inc: {
      type: Number,
      default: null,
    },
    bsp: {
      type: Number,
      default: null,
    },
    aimim: {
      type: Number,
      default: null,
    },
    iuml: {
      type: Number,
      default: null,
    },
    sbp: {
      type: Number,
      default: null,
    },
    vba: {
      type: Number,
      default: null,
    },
    cpi: {
      type: Number,
      default: null,
    },
    cpi_m: {
      type: Number,
      default: null,
    },
    bmup: {
      type: Number,
      default: null,
    },
    bva: {
      type: Number,
      default: null,
    },
    mks: {
      type: Number,
      default: null,
    },
    apoi: {
      type: Number,
      default: null,
    },
    rbs: {
      type: Number,
      default: null,
    },
    hbp: {
      type: Number,
      default: null,
    },
    jap: {
      type: Number,
      default: null,
    },
    aap_p: {
      type: Number,
      default: null,
    },
    jac: {
      type: Number,
      default: null,
    },
    bmfp: {
      type: Number,
      default: null,
    },
    ppid: {
      type: Number,
      default: null,
    },
    mlpi_red_flag: {
      type: Number,
      default: null,
    },
    sp: {
      type: Number,
      default: null,
    },
    pecp: {
      type: Number,
      default: null,
    },
    bbp: {
      type: Number,
      default: null,
    },
    hap: {
      type: Number,
      default: null,
    },
    hjp: {
      type: Number,
      default: null,
    },
    bp: {
      type: Number,
      default: null,
    },
    rtorp: {
      type: Number,
      default: null,
    },
    arp: {
      type: Number,
      default: null,
    },
    rmp: {
      type: Number,
      default: null,
    },
    pjp: {
      type: Number,
      default: null,
    },
    bahump: {
      type: Number,
      default: null,
    },
    ljgp: {
      type: Number,
      default: null,
    },
    blrp: {
      type: Number,
      default: null,
    },
    abep: {
      type: Number,
      default: null,
    },
    bpsp: {
      type: Number,
      default: null,
    },
    jmbp: {
      type: Number,
      default: null,
    },
    janadip: {
      type: Number,
      default: null,
    },
    bjap: {
      type: Number,
      default: null,
    },
    bmfdp: {
      type: Number,
      default: null,
    },
    rkd: {
      type: Number,
      default: null,
    },
    prcp: {
      type: Number,
      default: null,
    },
    ruc: {
      type: Number,
      default: null,
    },
    anc: {
      type: Number,
      default: null,
    },
    aimf: {
      type: Number,
      default: null,
    },
    baresp: {
      type: Number,
      default: null,
    },
    ssrd: {
      type: Number,
      default: null,
    },
    dmsk: {
      type: Number,
      default: null,
    },
    kkjhs: {
      type: Number,
      default: null,
    },
    bns: {
      type: Number,
      default: null,
    },
    bpsjp: {
      type: Number,
      default: null,
    },
    bbkd: {
      type: Number,
      default: null,
    },
    pup: {
      type: Number,
      default: null,
    },
    rjsp_s: {
      type: Number,
      default: null,
    },
    btp: {
      type: Number,
      default: null,
    },
    lksgm: {
      type: Number,
      default: null,
    },
    ggp: {
      type: Number,
      default: null,
    },
    stbp: {
      type: Number,
      default: null,
    },
    rjbp: {
      type: Number,
      default: null,
    },
    brsp: {
      type: Number,
      default: null,
    },
    balp: {
      type: Number,
      default: null,
    },
    djhp: {
      type: Number,
      default: null,
    },
    csm: {
      type: Number,
      default: null,
    },
    mndp: {
      type: Number,
      default: null,
    },
    alp: {
      type: Number,
      default: null,
    },
    abhs: {
      type: Number,
      default: null,
    },
    bpp: {
      type: Number,
      default: null,
    },
    nnp: {
      type: Number,
      default: null,
    },
    msp: {
      type: Number,
      default: null,
    },
    bkp: {
      type: Number,
      default: null,
    },
    hnd: {
      type: Number,
      default: null,
    },
    dspvad: {
      type: Number,
      default: null,
    },
    rrp: {
      type: Number,
      default: null,
    },
    bap: {
      type: Number,
      default: null,
    },
    hpp: {
      type: Number,
      default: null,
    },
    bbd: {
      type: Number,
      default: null,
    },
    rjanpty: {
      type: Number,
      default: null,
    },
    bscp: {
      type: Number,
      default: null,
    },
    rajsp: {
      type: Number,
      default: null,
    },
    rsp_s: {
      type: Number,
      default: null,
    },
    akhp: {
      type: Number,
      default: null,
    },
    rjp_s: {
      type: Number,
      default: null,
    },
    ind_1: {
      type: Number,
      default: null,
    },
    ind_2: {
      type: Number,
      default: null,
    },
    ind_3: {
      type: Number,
      default: null,
    },
    ind_4: {
      type: Number,
      default: null,
    },
    ind_5: {
      type: Number,
      default: null,
    },
    ind_6: {
      type: Number,
      default: null,
    },
    ind_7: {
      type: Number,
      default: null,
    },
    ind_8: {
      type: Number,
      default: null,
    },
    ind_9: {
      type: Number,
      default: null,
    },
    ind_10: {
      type: Number,
      default: null,
    },
    ind_11: {
      type: Number,
      default: null,
    },
    ind_12: {
      type: Number,
      default: null,
    },
    ind_13: {
      type: Number,
      default: null,
    },
    ind_14: {
      type: Number,
      default: null,
    },
    ind_15: {
      type: Number,
      default: null,
    },
    ind_16: {
      type: Number,
      default: null,
    },
    ind_17: {
      type: Number,
      default: null,
    },
    ind_18: {
      type: Number,
      default: null,
    },
    ind_19: {
      type: Number,
      default: null,
    },
    ind_20: {
      type: Number,
      default: null,
    },
    ind_21: {
      type: Number,
      default: null,
    },
    ind_22: {
      type: Number,
      default: null,
    },
    ind_23: {
      type: Number,
      default: null,
    },
    ind_24: {
      type: Number,
      default: null,
    },
    ind_26: {
      type: Number,
      default: null,
    },
    valid_votes: {
      type: Number,
      required: true,
    },
    rejected_votes: {
      type: Number,
      default: 0,
    },
    nota: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    tendered_votes: {
      type: Number,
      default: 0,
    },
    winner_party: {
      type: String,
      required: true,
    },
    winner_party_votes: {
      type: Number,
      required: true,
    },
    winner_voteshare: {
      type: Number,
      required: true,
    },
    first_runnerup_party: {
      type: String,
      required: true,
    },
    first_runnerup_votes: {
      type: Number,
      required: true,
    },
    first_runnerup_voteshare: {
      type: Number,
      required: true,
    },
    second_runnerup_party: {
      type: String,
      required: true,
    },
    second_runnerup_votes: {
      type: Number,
      required: true,
    },
    second_runnerup_voteshare: {
      type: Number,
      required: true,
    },
    third_runnerup_party: {
      type: String,
      required: true,
    },
    third_runnerup_votes: {
      type: Number,
      required: true,
    },
    third_runnerup_voteshare: {
      type: Number,
      required: true,
    },
    shs_rank: {
      type: Number,
      default: null,
    },
    bjp_rank: {
      type: Number,
      default: null,
    },
    inc_rank: {
      type: Number,
      default: null,
    },
    ncp_rank: {
      type: Number,
      default: null,
    },
    vba_rank: {
      type: Number,
      default: null,
    },
    bmup_rank: {
      type: Number,
      default: null,
    },
    bsp_rank: {
      type: Number,
      default: null,
    },
    aimim_rank: {
      type: Number,
      default: null,
    },
    apoi_rank: {
      type: Number,
      default: null,
    },
    bva_rank: {
      type: Number,
      default: null,
    },
    cpi_m_rank: {
      type: Number,
      default: null,
    },
    msp_rank: {
      type: Number,
      default: null,
    },
    sp_rank: {
      type: Number,
      default: null,
    },
    ind_1_rank: {
      type: Number,
      default: null,
    },
    ind_2_rank: {
      type: Number,
      default: null,
    },
    ind_3_rank: {
      type: Number,
      default: null,
    },
    ind_4_rank: {
      type: Number,
      default: null,
    },
    ind_5_rank: {
      type: Number,
      default: null,
    },
    ind_6_rank: {
      type: Number,
      default: null,
    },
    ind_7_rank: {
      type: Number,
      default: null,
    },
    ind_8_rank: {
      type: Number,
      default: null,
    },
    ind_9_rank: {
      type: Number,
      default: null,
    },
    ind_10_rank: {
      type: Number,
      default: null,
    },
    ind_11_rank: {
      type: Number,
      default: null,
    },
    ind_12_rank: {
      type: Number,
      default: null,
    },
    ind_13_rank: {
      type: Number,
      default: null,
    },
    ind_14_rank: {
      type: Number,
      default: null,
    },
    ind_15_rank: {
      type: Number,
      default: null,
    },
    ind_16_rank: {
      type: Number,
      default: null,
    },
    ind_17_rank: {
      type: Number,
      default: null,
    },
    ind_18_rank: {
      type: Number,
      default: null,
    },
    ind_19_rank: {
      type: Number,
      default: null,
    },
    ind_20_rank: {
      type: Number,
      default: null,
    },
    ind_21_rank: {
      type: Number,
      default: null,
    },
    ind_22_rank: {
      type: Number,
      default: null,
    },
    ind_23_rank: {
      type: Number,
      default: null,
    },
    ind_24_rank: {
      type: Number,
      default: null,
    },
    ind_26_rank: {
      type: Number,
      default: null,
    },
    shs_margin: {
      type: Number,
      default: null,
    },
    bjp_margin: {
      type: Number,
      default: null,
    },
    inc_margin: {
      type: Number,
      default: null,
    },
    ncp_margin: {
      type: Number,
      default: null,
    },
    vba_margin: {
      type: Number,
      default: null,
    },
    bmup_margin: {
      type: Number,
      default: null,
    },
    bsp_margin: {
      type: Number,
      default: null,
    },
    aimim_margin: {
      type: Number,
      default: null,
    },
    apoi_margin: {
      type: Number,
      default: null,
    },
    bva_margin: {
      type: Number,
      default: null,
    },
    cpi_m_margin: {
      type: Number,
      default: null,
    },
    msp_margin: {
      type: Number,
      default: null,
    },
    sp_margin: {
      type: Number,
      default: null,
    },
    ind_1_margin: {
      type: Number,
      default: null,
    },
    ind_2_margin: {
      type: Number,
      default: null,
    },
    ind_3_margin: {
      type: Number,
      default: null,
    },
    ind_4_margin: {
      type: Number,
      default: null,
    },
    ind_5_margin: {
      type: Number,
      default: null,
    },
    ind_6_margin: {
      type: Number,
      default: null,
    },
    ind_7_margin: {
      type: Number,
      default: null,
    },
    ind_8_margin: {
      type: Number,
      default: null,
    },
    ind_9_margin: {
      type: Number,
      default: null,
    },
    ind_10_margin: {
      type: Number,
      default: null,
    },
    ind_11_margin: {
      type: Number,
      default: null,
    },
    ind_12_margin: {
      type: Number,
      default: null,
    },
    ind_13_margin: {
      type: Number,
      default: null,
    },
    ind_14_margin: {
      type: Number,
      default: null,
    },
    ind_15_margin: {
      type: Number,
      default: null,
    },
    ind_16_margin: {
      type: Number,
      default: null,
    },
    ind_17_margin: {
      type: Number,
      default: null,
    },
    ind_18_margin: {
      type: Number,
      default: null,
    },
    ind_19_margin: {
      type: Number,
      default: null,
    },
    ind_20_margin: {
      type: Number,
      default: null,
    },
    ind_21_margin: {
      type: Number,
      default: null,
    },
    ind_22_margin: {
      type: Number,
      default: null,
    },
    ind_23_margin: {
      type: Number,
      default: null,
    },
    ind_24_margin: {
      type: Number,
      default: null,
    },
    ind_26_margin: {
      type: Number,
      default: null,
    },
    biploar_multipolar_flag: {
      type: String,
      default: null,
    },
    shs_voteshare: {
      type: Number,
      default: null,
    },
    bjp_voteshare: {
      type: Number,
      default: null,
    },
    ncp_voteshare: {
      type: Number,
      default: null,
    },
    inc_voteshare: {
      type: Number,
      default: null,
    },
    apoi_voteshare: {
      type: Number,
      default: null,
    },
    cpim_voteshare: {
      type: Number,
      default: null,
    },
    msp_voteshare: {
      type: Number,
      default: null,
    },
    aimim_voteshare: {
      type: Number,
      default: null,
    },
    sp_voteshare: {
      type: Number,
      default: null,
    },
    vba_voteshare: {
      type: Number,
      default: null,
    },
    bva_voteshare: {
      type: Number,
      default: null,
    },
    bmup_voteshare: {
      type: Number,
      default: null,
    },
    bsp_voteshare: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);
const SurveyRetro = mongoose.model("Pc-Retro", surveySchemaRetro);

module.exports = SurveyRetro;
