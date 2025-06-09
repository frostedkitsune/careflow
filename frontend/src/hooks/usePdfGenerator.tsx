import type { PrescriptionData } from '@/lib/types';
import { pdf, Document, Page, Text, View, Font, StyleSheet } from '@react-pdf/renderer';


// Styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#009689',
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
        marginBottom: 4,
        textAlign: 'center',
    },
    doctorInfo: {
        marginTop: 10,
        fontSize: 11,
        color: '#333',
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
        padding: 10,
        border: '1px solid #eee',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#009689',
        borderBottom: '1px solid #eee',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        width: 70,
        fontSize: 11,
        fontWeight: 'bold',
        color: '#444',
    },
    value: {
        flex: 1,
        fontSize: 11,
        color: '#333',
    },
    twoColumnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    col: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    multilineValue: {
        fontSize: 11,
        color: '#333',
        paddingLeft: 10,
    },
    footer: {
        marginTop: 40,
        fontSize: 12,
        textAlign: 'center',
        color: 'gray',
        borderTop: '1px solid #eee',
        paddingTop: 10,
    },
    poweredby: {
        marginTop: 10,
        fontSize: 9,
        textAlign: 'center',
        color: 'gray',
    },
});

// Mock doctor data (you can replace with useDoctorStore().doctor)
const doctor = {
    id: 1,
    name: 'Dr. Alice Johnson',
    email: 'alice.j@example.com',
    phone: '1112223333',
    specialization: 'Cardiology',
};

const PrescriptionPdf = ({ prescription }: { prescription: PrescriptionData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Medical Prescription</Text>
                <Text style={styles.subtitle}>Careflow Medical Centre</Text>
                <Text style={styles.doctorInfo}>
                    {doctor.name} ({doctor.specialization}) | Ph: {doctor.phone} | Reg. No: 52547
                </Text>
            </View>

            {/* Patient Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Patient Information</Text>

                <View style={styles.twoColumnRow}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{prescription.patient.name}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>DOB:</Text>
                        <Text style={styles.value}>{new Date(prescription.patient.dob).toLocaleDateString()}</Text>
                    </View>
                </View>

                <View style={styles.twoColumnRow}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Gender:</Text>
                        <Text style={styles.value}>{prescription.patient.gender}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>Phone:</Text>
                        <Text style={styles.value}>{prescription.patient.phone}</Text>
                    </View>
                </View>
            </View>

            {/* Medication */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prescription Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Medication:</Text>
                    <Text style={styles.value}>{prescription.prescription.medication || 'N/A'}</Text>
                </View>
            </View>

            {/* Observation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Medical Observations</Text>
                <Text style={styles.multilineValue}>
                    {prescription.prescription.observation || 'No observations noted.'}
                </Text>
            </View>

            {/* Advice */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Medical Advice</Text>
                <Text style={styles.multilineValue}>
                    {prescription.prescription.advise || 'No specific advice given.'}
                </Text>
            </View>

            {/* Tests */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommended Tests</Text>
                <Text style={styles.multilineValue}>
                    {prescription.prescription.test || 'No tests recommended.'}
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Prescribed on: {new Date().toLocaleDateString()}</Text>
            </View>
            <View style={styles.poweredby}>
                <Text>Powered by Careflow</Text>
            </View>
        </Page>
    </Document>
);

// Hook to generate and download the PDF
export const usePdfGenerator = () => {
    const generatePdf = async (prescription: PrescriptionData) => {
        const blob = await pdf(<PrescriptionPdf prescription={prescription} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `prescription_${prescription.patient.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return { generatePdf };
};
