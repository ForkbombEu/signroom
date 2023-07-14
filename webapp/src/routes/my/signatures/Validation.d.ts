export interface ValidationData {
    validationReportDataHandler: string;
    DiagnosticData:              DiagnosticData;
    SimpleReport:                SimpleReport;
    DetailedReport:              DetailedReport;
}

export interface DetailedReport {
    signatureOrTimestampOrCertificate: SignatureOrTimestampOrCertificate[];
    BasicBuildingBlocks:               BasicBuildingBlock[];
    TLAnalysis:                        any[];
    Semantic:                          null;
    ValidationTime:                    Date;
}

export interface BasicBuildingBlock {
    FC:               Fc;
    ISC:              Fc;
    VCI:              Fc;
    XCV:              Xcv;
    CV:               Cv;
    SAV:              Cv;
    PSV:              null;
    PSV_CRS:          null;
    PCV:              null;
    VTS:              null;
    CertificateChain: BasicBuildingBlockCertificateChain;
    Conclusion:       Conclusion;
    Id:               string;
    Type:             string;
}

export interface Cv {
    Constraint:               Constraint[];
    Conclusion:               Conclusion;
    Title:                    string;
    CryptographicValidation?: CryptographicValidation;
}

export interface Conclusion {
    Indication:    Indication;
    SubIndication: null | string;
    Errors:        Name[] | null;
    Warnings:      Name[] | null;
    Infos:         any[] | null;
}

export interface Name {
    value: string;
    Key:   string;
}

export enum Indication {
    Failed = "FAILED",
    Indeterminate = "INDETERMINATE",
    Passed = "PASSED",
}

export interface Constraint {
    Name:           Name;
    Status:         Status;
    Error:          Name | null;
    Warning:        Name | null;
    Info:           null;
    AdditionalInfo: null | string;
    Id:             null | string;
    BlockType:      null;
}

export enum Status {
    NotOk = "NOT OK",
    Ok = "OK",
    Warning = "WARNING",
}

export interface CryptographicValidation {
    Algorithm:         Algorithm;
    NotAfter:          Date;
    ValidationTime:    Date;
    ConcernedMaterial: string;
    secure:            boolean;
}

export interface Algorithm {
    Name:      string;
    Uri:       string;
    KeyLength: string;
}

export interface BasicBuildingBlockCertificateChain {
    ChainItem: CertificateChainChainItem[];
}

export interface CertificateChainChainItem {
    Source: string;
    Id:     string;
}

export interface Fc {
    Constraint:        Constraint[];
    Conclusion:        Conclusion;
    Title:             string;
    CertificateChain?: BasicBuildingBlockCertificateChain;
}

export interface Xcv {
    SubXCV?:           any[];
    Constraint:        Constraint[];
    Conclusion:        Conclusion;
    Title:             string;
    ProofOfExistence?: ProofOfExistence;
}

export interface ProofOfExistence {
    Time:        Date;
    TimestampId: null;
}

export interface SignatureOrTimestampOrCertificate {
    Signature: SignatureOrTimestampOrCertificateSignature;
}

export interface SignatureOrTimestampOrCertificateSignature {
    ValidationProcessBasicSignature:  ValidationProcessBasicSignature;
    Timestamp:                        any[];
    ValidationProcessLongTermData:    ValidationProcessLongTermData;
    ValidationProcessArchivalData:    Xcv;
    ValidationSignatureQualification: ValidationSignatureQualification;
    Conclusion:                       Conclusion;
    Id:                               string;
    CounterSignature:                 null;
}

export interface ValidationProcessBasicSignature {
    Constraint:       Constraint[];
    Conclusion:       Conclusion;
    Title:            string;
    ProofOfExistence: ProofOfExistence;
}

export interface ValidationProcessLongTermData {
    CRS:              null;
    RFC:              null;
    Constraint:       Constraint[];
    Conclusion:       Conclusion;
    Title:            string;
    ProofOfExistence: ProofOfExistence;
}

export interface ValidationSignatureQualification {
    ValidationCertificateQualification: any[];
    Constraint:                         Constraint[];
    Conclusion:                         Conclusion;
    Title:                              string;
    SignatureQualification:             string;
}

export interface DiagnosticData {
    DocumentName:   string;
    ValidationDate: Date;
    ContainerInfo:  null;
    PDFAInfo:       null;
    Signature:      SignatureElement[];
    Certificate:    DiagnosticDataCertificate[];
    Revocation:     any[];
    Timestamp:      any[];
    OrphanTokens:   null;
    SignerData:     SignerDatum[];
    TrustedList:    any[];
}

export interface DiagnosticDataCertificate {
    Id:                       string;
    SubjectDistinguishedName: DistinguishedName[];
    IssuerDistinguishedName:  DistinguishedName[];
    SerialNumber:             number;
    SubjectSerialNumber:      null;
    CommonName:               string;
    Locality:                 string;
    State:                    string;
    CountryName:              string;
    OrganizationIdentifier:   null;
    OrganizationName:         string;
    OrganizationalUnit:       string;
    Title:                    null;
    GivenName:                null;
    Surname:                  null;
    Pseudonym:                null;
    Email:                    null;
    Source:                   string[];
    NotAfter:                 Date;
    NotBefore:                Date;
    PublicKeySize:            number;
    PublicKeyEncryptionAlgo:  string;
    EntityKey:                string;
    BasicSignature:           BasicSignature;
    SigningCertificate:       null;
    ChainItem:                any[];
    Trusted:                  boolean;
    SelfSigned:               boolean;
    certificateExtensions:    any[];
    TrustedServiceProvider:   any[];
    CertificateRevocation:    null;
    Base64Encoded:            null;
    DigestAlgoAndValue:       DigestAlgoAndValue;
}

export interface BasicSignature {
    EncryptionAlgoUsedToSignThisToken:         string;
    KeyLengthUsedToSignThisToken:              string;
    DigestAlgoUsedToSignThisToken:             string;
    MaskGenerationFunctionUsedToSignThisToken: null;
    SignatureIntact:                           boolean;
    SignatureValid:                            boolean;
}

export interface DigestAlgoAndValue {
    DigestMethod: string;
    DigestValue:  string;
    match:        boolean | null;
}

export interface DistinguishedName {
    value:  string;
    Format: string;
}

export interface SignatureElement {
    Id:                            string;
    DAIdentifier:                  string;
    SignatureFilename:             string;
    ErrorMessage:                  null;
    ClaimedSigningTime:            Date;
    SignatureFormat:               string;
    StructuralValidation:          StructuralValidation;
    DigestMatcher:                 DigestMatcher[];
    BasicSignature:                BasicSignature;
    SigningCertificate:            SigningCertificate;
    ChainItem:                     SignatureChainItem[];
    ContentType:                   null;
    MimeType:                      string;
    ContentIdentifier:             null;
    ContentHints:                  null;
    SignatureProductionPlace:      null;
    CommitmentTypeIndication:      any[];
    SignerRole:                    any[];
    Policy:                        null;
    SignaturePolicyStore:          null;
    SignerInfo:                    null;
    PDFRevision:                   null;
    VRIDictionaryCreationTime:     null;
    SignerDocumentRepresentations: SignerDocumentRepresentations;
    FoundCertificates:             FoundCertificates;
    FoundRevocations:              FoundRevocations;
    FoundTimestamp:                any[];
    SignatureScope:                PurpleSignatureScope[];
    SignatureDigestReference:      SignatureDigestReference;
    DataToBeSignedRepresentation:  DigestAlgoAndValue;
    SignatureValue:                string;
    CounterSignature:              null;
    Parent:                        null;
    Duplicated:                    null;
}

export interface SignatureChainItem {
    Certificate: string;
}

export interface DigestMatcher {
    DataFound:    boolean;
    DataIntact:   boolean;
    DigestMethod: string;
    DigestValue:  string;
    match:        null;
    type:         string;
    name:         string;
    duplicated:   null;
}

export interface FoundCertificates {
    RelatedCertificate: RelatedCertificate[];
    OrphanCertificate:  any[];
}

export interface RelatedCertificate {
    Origin:         string[];
    CertificateRef: CertificateRef[];
    Certificate:    string;
}

export interface CertificateRef {
    Origin:             string;
    IssuerSerial:       IssuerSerial;
    DigestAlgoAndValue: DigestAlgoAndValue;
    SerialInfo:         null;
}

export interface IssuerSerial {
    value: string;
    match: boolean;
}

export interface FoundRevocations {
    RelatedRevocation: any[];
    OrphanRevocation:  any[];
}

export interface SignatureDigestReference {
    CanonicalizationMethod: string;
    DigestMethod:           string;
    DigestValue:            string;
}

export interface PurpleSignatureScope {
    Scope:          string;
    Name:           string;
    Description:    string;
    Transformation: string[];
    SignerData:     string;
}

export interface SignerDocumentRepresentations {
    HashOnly:    boolean;
    DocHashOnly: boolean;
}

export interface SigningCertificate {
    PublicKey:   null;
    Certificate: string;
}

export interface StructuralValidation {
    Message: any[];
    valid:   boolean;
}

export interface SignerDatum {
    Id:                 string;
    ReferencedName:     string;
    DigestAlgoAndValue: DigestAlgoAndValue;
    Parent:             null;
}

export interface SimpleReport {
    ValidationPolicy:     ValidationPolicy;
    DocumentName:         string;
    ValidSignaturesCount: number;
    SignaturesCount:      number;
    ContainerType:        null;
    PDFAInfo:             null;
    signatureOrTimestamp: SignatureOrTimestamp[];
    Semantic:             null;
    ValidationTime:       Date;
}

export interface ValidationPolicy {
    PolicyName:        string;
    PolicyDescription: string;
}

export interface SignatureOrTimestamp {
    Signature: SignatureOrTimestampSignature;
}

export interface SignatureOrTimestampSignature {
    SigningTime:           Date;
    BestSignatureTime:     Date;
    SignedBy:              string;
    SignatureLevel:        SignatureLevel;
    SignatureScope:        FluffySignatureScope[];
    Timestamps:            null;
    Filename:              null;
    CertificateChain:      SignatureCertificateChain;
    Indication:            Indication;
    SubIndication:         string;
    AdESValidationDetails: AtionDetails;
    QualificationDetails:  AtionDetails;
    Id:                    string;
    CounterSignature:      null;
    ParentId:              null;
    SignatureFormat:       string;
    ExtensionPeriodMin:    null;
    ExtensionPeriodMax:    null;
}

export interface AtionDetails {
    Error:   Name[];
    Warning: Name[];
    Info:    any[];
}

export interface SignatureCertificateChain {
    Certificate: CertificateChainCertificate[];
}

export interface CertificateChainCertificate {
    QualifiedName: string;
    TrustAnchors:  null;
    Id:            string;
    trusted:       null;
}

export interface SignatureLevel {
    value:       string;
    description: string;
}

export interface FluffySignatureScope {
    value: string;
    Id:    string;
    name:  string;
    scope: string;
}
