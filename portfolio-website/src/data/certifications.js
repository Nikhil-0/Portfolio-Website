// ---------------------------------------------------------------------------
// Certifications shown on the Projects & Experience page.
// To add one: import its image below and add an entry to the array.
//   { title, image, issuer, url? }   — url is optional (links the card out).
// ---------------------------------------------------------------------------
import pythonCert from '../assets/Py_Cert.png';
import ociJava from '../assets/OCI_Java_Explorer_Badge.png';
import ociFoundations from '../assets/OCI_AI_Foundations.png';
import ociGenAI from '../assets/OCI_GenAI.png';
import ociVectorSearch from '../assets/OCI_VectorSearch.png';
import ociMySQL from '../assets/Oracle MySQL Explorer Badge.png';
import ociMySQLHeatwave from '../assets/Oracle MySQL Heatwave.jpg';
import bloombergFundamentals from '../assets/Bloomberg_Finance_Fundamentals_Cert.png';
import bloombergMarket from '../assets/Bloomberg_Market_Concepts_Cert.png';
import awsCloudEssentials from '../assets/AWS Cloud Practitioner Essentials.png';
import googleAI from '../assets/Google AI Cert.png';
import googlePM from '../assets/Google PM Cert.png';

export const certifications = [
  { title: 'Python Certification', issuer: '', image: pythonCert },
  { title: 'Oracle Java Explorer', issuer: 'Oracle', image: ociJava },
  { title: 'OCI AI Foundations', issuer: 'Oracle', image: ociFoundations },
  { title: 'OCI Generative AI Professional', issuer: 'Oracle', image: ociGenAI },
  { title: 'OCI Vector Search Professional', issuer: 'Oracle', image: ociVectorSearch },
  { title: 'Bloomberg Finance Fundamentals', issuer: 'Bloomberg', image: bloombergFundamentals },
  { title: 'Bloomberg Market Concepts', issuer: 'Bloomberg', image: bloombergMarket },
  { title: 'Oracle MySQL Explorer', issuer: 'Oracle', image: ociMySQL },
  { title: 'Oracle MySQL HeatWave Implementation Associate', issuer: 'Oracle', image: ociMySQLHeatwave },
  { title: 'AWS Cloud Practitioner Essentials', issuer: 'Amazon Web Services', image: awsCloudEssentials },
  { title: 'Google AI Professional', issuer: 'Google', image: googleAI },
  { title: 'Google Project Management Professional', issuer: 'Google', image: googlePM },
];
