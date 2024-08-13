import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_NOTES, GET_NOTE_ID } from "../../../types/noteQueries";
import {
  UPDATE_NOTE,
  UpdateNoteVars,
  UpdateNoteData,
} from "../../../types/noteQueries";
import Header from "../../../components/Header";
import { Note } from "../../../types/note";

const EditNotePage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;

  const noteId = Array.isArray(id) ? id[0] : id;

  const { data, loading, error } = useQuery<{ note: Note }>(GET_NOTE_ID, {
    variables: { id: noteId as string },
    skip: !noteId,
  });

  const [updateNote] = useMutation<UpdateNoteData, UpdateNoteVars>(
    UPDATE_NOTE,
    {
      update(cache, { data }) {
        if (!data) return;

        const existingNotes = cache.readQuery<{ notes: Note[] }>({
          query: GET_NOTES,
        });

        if (existingNotes) {
          cache.writeQuery({
            query: GET_NOTES,
            data: {
              notes: existingNotes.notes.map((note) =>
                note.id === data.updateNote.id ? data.updateNote : note
              ),
            },
          });
        }
      },
      onError: (error) => {
        console.error("Error updating cache:", error);
      },
    }
  );

  useEffect(() => {
    if (data?.note) {
      setTitle(data.note.title);
      setBody(data.note.body);
    }
  }, [data]);

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      toast({
        title: "Error",
        description: "Judul dan isi diperlukan.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateNote({
        variables: {
          id: noteId as string,
          title,
          body,
        },
        refetchQueries: [{ query: GET_NOTES }],
      });
      toast({
        render: () => (
          <Box
            bg="#d5b990"
            color="white"
            p={3}
            borderRadius="md"
            boxShadow="md"
          >
            <Heading size="sm">Catatan diperbarui.</Heading>
            <Box mt={2}>Catatan Anda telah berhasil diperbarui.</Box>
          </Box>
        ),
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to update the note.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Header />;
  }

  if (error) {
    return <p>Error loading note: {error.message}</p>;
  }

  return (
    <>
      <Header />
      <main>
        <Box maxW="2xl" mx="auto" px={4} py={8}>
          <Heading as="h1" size="lg" mb={4}>
            Edit Catatan
          </Heading>
          <Box
            as="form"
            onSubmit={(e: { preventDefault: () => void }) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <FormControl id="title" mb={4} borderColor="#c7a26b">
              <FormLabel>Judul</FormLabel>
              <Input
                focusBorderColor="#6F532A"
                placeholder="Masukkan judul catatan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isDisabled={isSubmitting}
              />
            </FormControl>
            <FormControl id="content" mb={4} borderColor="#c7a26b">
              <FormLabel>Isi</FormLabel>
              <Textarea
                focusBorderColor="#6F532A"
                placeholder="Masukkan isi catatan"
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                isDisabled={isSubmitting}
              />
            </FormControl>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outline"
                fontWeight="light"
                borderColor="#bc965c"
                bgColor="#ECE3D4"
                _hover={{ bg: "#D89F4B" }}
                onClick={() => router.push("/")}
                isDisabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                fontWeight="light"
                bgColor="#d5b990"
                _hover={{ bg: "#e3d1b5" }}
                type="submit"
                isDisabled={isSubmitting}
              >
                Simpan Catatan
              </Button>
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
};

export default EditNotePage;
