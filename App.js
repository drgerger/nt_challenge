import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

const {height, width } = Dimensions.get('window');
// boilerplate from GPT -- will definitely have to fine tune

// todo: fix functionality for progress bar

const App = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleDots, setVisibleDots] = useState(7); // will use these later

  useEffect(() => {
    axios.get('http://localhost:3000/states')
      .then(response => setStates(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSelect = (state) => {
    setSelectedState(state);
  };

  // handle dot press from gpt
  const handleDotPress = (index) => {
    flatListRef.current?.scrollToIndex({ index });
    setSelectedState(states[index]);
    setCurrentIndex(index);
  };

  // handle arrow press function from gpt
  const handleArrowPress = (direction) => {
    let newIndex = currentIndex;
    if (direction === 'left') {
      newIndex = Math.max(currentIndex - visibleDots, 0);
    } else if (direction === 'right') {
      newIndex = Math.min(currentIndex + visibleDots, states.length - visibleDots);
    }
    setCurrentIndex(newIndex);
    flatListRef.current?.scrollToIndex({ index: newIndex });
  };

  const renderDots = () => {
    const start = Math.max(currentIndex - Math.floor(visibleDots/2), 0); //moving dots
    const end = Math.min(start + visibleDots - 1, states.length - 1) // to correspond with scroll
  
    return (
        <View style={styles.dotContainer}>
            <TouchableOpacity
                style={styles.arrow}
                onPress={() => handleArrowPress('left')}
            ><Text style={styles.arrowText}>{'〈'}</Text>
            </TouchableOpacity>
            <View style={styles.dots}>
                {states.slice(start, end + 1).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {backgroundColor: start + index === currentIndex ? 'black' : "#d3d3d3"}
                        ]}
                    ></View>
                ))}
            </View>
            <TouchableOpacity
                style={styles.arrow}
                onPress={() => handleArrowPress('right')}
            ><Text style={styles.arrowText}>{'〉'}</Text>
            </TouchableOpacity>
        </View>
    );
};

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Savings carousel test</Text>
      <FlatList
        ref={flatListRef}
        data={states}
        horizontal
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: item === selectedState ? '#ddd' : '#fff' }]}
            onPress={() => {handleDotPress(index);}}
          >
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
        onScroll={(event) => {
            const index = Math.floor(
              event.nativeEvent.contentOffset.x / (width * 0.32)
            );
            setCurrentIndex(index);
            setSelectedState(states[index]);
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
      />
      <View style={styles.dotWrapper}>
            {renderDots()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2ef',
    paddingTop: height * 0.1,
  },
  item: {
    padding: 20,
    margin: 10,
    borderRadius: 15,
    width: width * 0.33,
    height: height * 0.1,
    shadowColor: 'gray',
    shadowOffset: { width:0, height:2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  itemText: {
    fontSize: 13,
    fontFamily: 'Arial',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Arial',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15, // sloppy way to do this... but alas...
    alignSelf: 'flex-start', // later need to make sure it is properly aligned with box
  },
  dotWrapper: {
    justifyContent: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 440, // again sloppy but alas
  },
  arrowText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  arrow: {
    paddingHorizontal: 8,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    marginLeft: 10,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});

export default App;
