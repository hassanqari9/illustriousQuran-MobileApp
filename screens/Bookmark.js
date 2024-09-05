import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const Bookmark = ({ navigation, route }) => {

  return (
    <View style={styles.center}>
      {/* <Text >This is the Planner screen</Text> */}

      <Text>Bookmark</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  }
});

export default Bookmark;

