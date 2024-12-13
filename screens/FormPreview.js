import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const FormPreview = ({ route, navigation }) => {
  const { questions, headerImage } = route.params;

  const handleSaveForm = async () => {
    if (!questions || questions.length === 0 || !headerImage) {
      Alert.alert('Validation Error', 'Please ensure all required fields are filled.');
      return;
    }

    try {
      const response = await fetch('https://backendassignment-2.onrender.com/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions, headerImage }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Form saved:', data);
        Alert.alert('Success', 'Form saved successfully.');
        // Navigate or perform other actions after successful save
        navigation.goBack();
      } else {
        const errorData = await response.json();
        console.error('Failed to save form:', errorData);
        Alert.alert('Error', errorData.message || 'Failed to save form.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while saving the form.');
    }
  };

  const renderQuestion = ({ item }) => (
    <View style={styles.questionContainer}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <Text style={styles.text}>{item.text || 'No question text provided'}</Text>
      {item.options.map((opt, index) => (
        <TouchableOpacity key={index} style={styles.optionContainer}>
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {headerImage && <Image source={{ uri: headerImage }} style={styles.headerImage} />}
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderQuestion}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleSaveForm}
      >
        <Text style={styles.backButtonText}>Save Form</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  listContainer: {
    padding: 16,
  },
  questionContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  backButton: {
    padding: 16,
    backgroundColor: '#6200ea',
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FormPreview;
