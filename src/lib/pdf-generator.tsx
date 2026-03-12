import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 20,
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    padding: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
  },
});

export const BookingVoucher = ({ booking }: { booking: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Travelipedia</Text>
        <View>
          <Text style={styles.title}>Booking Voucher</Text>
          <Text style={{ fontSize: 10, textAlign: 'right', color: '#6b7280' }}>
            ID: {booking.id.substring(0, 8).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Hotel Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hotel Information</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
          {booking.hotelBooking?.hotelName}
        </Text>
        <Text style={{ fontSize: 10, color: '#4b5563', marginBottom: 12 }}>
          {booking.hotelBooking?.city}
        </Text>
        
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Check-In</Text>
            <Text style={styles.value}>{new Date(booking.hotelBooking?.checkIn).toDateString()}</Text>
          </View>
          <View>
            <Text style={styles.label}>Check-Out</Text>
            <Text style={styles.value}>{new Date(booking.hotelBooking?.checkOut).toDateString()}</Text>
          </View>
          <View>
            <Text style={styles.label}>Guests</Text>
            <Text style={styles.value}>{booking.hotelBooking?.guests} Adults</Text>
          </View>
        </View>
      </View>

      {/* Guest Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guest Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Primary Guest</Text>
          <Text style={styles.value}>{booking.user.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{booking.user.email}</Text>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount Paid</Text>
          <Text style={[styles.value, { color: '#2563eb', fontSize: 14 }]}>
            INR {booking.totalAmount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Status</Text>
          <Text style={[styles.value, { color: '#059669' }]}>CONFIRMED</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={styles.value}>{booking.razorpayPaymentId}</Text>
        </View>
      </View>

      {/* Important Info */}
      <View style={styles.section}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>Important Information</Text>
        <Text style={{ fontSize: 9, color: '#4b5563', lineHeight: 1.5 }}>
          • Please present this voucher at the time of check-in.{"\n"}
          • Government ID proof is mandatory for all guests.{"\n"}
          • Standard check-in time is 12:00 PM and check-out time is 11:00 AM.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for booking with Travelipedia! | support@travelipedia.com | +91 1800-TRAVEL</Text>
      </View>
    </Page>
  </Document>
);
