import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewer = ({ route }) => {
  // Set up the source URL based on the route parameter
  const { languagePdf } = route.params || {};
  
  const sources = {
    kashmiri: { uri: 'https://ia804601.us.archive.org/4/items/kashmiri-quran-translation-the-nobel-quran-king-fahd-printing-complex/Kashmiri%20Quran%20Translation%20-%20The%20Nobel%20Quran%20-%20King%20Fahd%20Printing%20Complex.pdf', cache: true },
    gojri: { uri: 'https://ia601607.us.archive.org/0/items/gojri-quran/Gojri-Quran.pdf', cache: true },
  };
  
  const source = sources[languagePdf]

  return (
    <View style={styles.center}>
      <View style={styles.container}>
      {route?.params?.languagePdf ? <Pdf
          trustAllCerts={false}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        /> : <Text>Please Select a PDF To View</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white'
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PdfViewer;
