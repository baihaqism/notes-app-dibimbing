import { useQuery } from '@apollo/client';
import { Flex, Box, Heading, Text, Grid } from '@chakra-ui/react';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import { GET_NOTES, GetNotesData } from '../types/noteQueries';

export default function Home() {
  const { loading, error, data } = useQuery<GetNotesData>(GET_NOTES);

  if (loading) return <Header />;
  if (error) return <Text>Error: {error.message}</Text>;

  const notes = data?.notes || [];

  return (
    <Flex direction="column" h="100vh" bg="#ece3d4">
      <Header />
      <Box flex="1" overflowY="auto" p={6}>
        {notes.length > 0 ? (
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(4, 1fr)'  
            }}
            gap={6}
            p={6}
          >
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </Grid>
        ) : (
          <Flex align="center" justify="center" h="75%">
            <Box textAlign="center">
              <Heading as="h3" size="lg">Tidak ada catatan</Heading>
              <Text color="gray.500">Anda belum membuat catatan apapun.</Text>
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
