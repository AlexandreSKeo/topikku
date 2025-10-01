import { StyleSheet, ScrollView, View } from 'react-native';
import { Card, Text, Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const placeholderCards = [
    { id: 1, title: 'Card 1', description: 'This is a placeholder card' },
    { id: 2, title: 'Card 2', description: 'This is a placeholder card' },
    { id: 3, title: 'Card 3', description: 'This is a placeholder card' },
    { id: 4, title: 'Card 4', description: 'This is a placeholder card' },
    { id: 5, title: 'Card 5', description: 'This is a placeholder card' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.Content title="Topikku" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {placeholderCards.map((card) => (
          <Card key={card.id} style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                {card.title}
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                {card.description}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    marginBottom: 4,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardDescription: {
    opacity: 0.7,
  },
});
