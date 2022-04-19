export interface UoBranch {
    Away: boolean;
    entID: number;
    entType: string;
    intHP: number;
    intHPMax: number;
    intLevel: number;
    intMP: number;
    intMPMax: number;
    intState: number;
    showCloak: boolean;
    showHelm: boolean;
    strFrame: string;
    strPad: string;
    strUsername: string;
    tx: number;
    ty: number;
    uoName: string;
    isAdopted: boolean;
}

export interface MonBranch {
    MonID: string;
    MonMapID: string;
    bRed: boolean;
    iLvl: number;
    intHP: number;
    intHPMax: number;
    intMP: number;
    intMPMax: number;
    intState: number;
    wDPS: number;
}

export interface NpcBranch {
    NpcID: string;
    NpcMapID: string;
    iLvl: number;
    intHP: number;
    intHPMax: number;
    intMP: number;
    intMPMax: number;
    intState: number;
    wDPS: number;
    isAdopted: boolean;
}

export interface Mondef {
    MonID: string;
    intHP: number;
    intHPMax: number;
    intLevel: number;
    intMP: number;
    intMPMax: number;
    sRace: string;
    isWorldBoss: boolean;
    strBehave: string;
    strElement: string;
    strLinkage: string;
    strMonFileName: string;
    strMonName: string;
}

export interface Monmap {
    MonID: string;
    MonMapID: string;
    bRed: boolean;
    intRSS: string;
    strFrame: string;
}

export interface Npcdef {
    MonID: string;
    intHP: number;
    intHPMax: number;
    intLevel: number;
    intMP: number;
    intMPMax: number;
}

export interface Co {
    ItemID: number;
    sFile: string;
    sLink: string;
}

export interface Ba {
    ItemID: number;
    sFile: string;
    sLink: string;
}

export interface He {
    ItemID: number;
    sFile: string;
    sLink: string;
}

export interface Eqp {
    co: Co;
    ba: Ba;
    he: He;
}

export interface StartTime {
    date: number;
    day: number;
    hours: number;
    minutes: number;
    month: number;
    nanos: number;
    seconds: number;
    time: number;
    timezoneOffset: number;
    year: number;
}

export interface EndTime {
    date: number;
    day: number;
    hours: number;
    minutes: number;
    month: number;
    nanos: number;
    seconds: number;
    time: number;
    timezoneOffset: number;
    year: number;
}

export interface Action {
    Name: string;
    NameColor: string;
    Subtitle: string;
    SubtitleColor: string;
    Action: string;
    Value: string;
    Icon: string;
    IsStaffOnly: boolean;
}

export interface Npcmap {
    NpcID: number;
    strUsername: string;
    strGender: string;
    strHairFilename: string;
    strHairName: string;
    intLevel: number;
    strClassName: string;
    intColorEye: number;
    intColorHair: number;
    intColorSkin: number;
    intColorTrim: number;
    intColorBase: number;
    intColorAccessory: number;
    intColorName: number;
    strChatColor: number;
    isAdopted: boolean;
    eqp: Eqp;
    X: number;
    Y: number;
    face: string;
    frame: string;
    animation: string;
    state: string;
    startTime: StartTime;
    endTime: EndTime;
    isStaffOnly: boolean;
    actions: Action[];
    dialogues: string[];
    NpcMapID: string;
    bRed: number;
    intRSS: string;
    strFrame: string;
}

export default interface IMoveToArea {
    cmd: string;
    areaId: number;
    areaName: string;
    areaCap: number;
    isCycle: boolean;
    sExtra: string;
    strMusic: string;
    strMapFileName: string;
    strMapName: string;
    uoBranch: UoBranch[];
    monBranch: MonBranch[];
    npcBranch: NpcBranch[];
    intType: number;
    mondef: Mondef[];
    monmap: Monmap[];
    npcdef: Npcdef[];
    npcmap: Npcmap[];
}