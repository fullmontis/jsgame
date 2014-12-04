while(<*.wav>) {
  ($oggName = $_) =~ s/\.wav/\.ogg/;
  ($aacName = $_) =~ s/\.wav/\.m4a/;
  print "Converting $_";
  system("ffmpeg -y -i $_ -c:a libvorbis -b:a 64k $oggName");
  system("ffmpeg -y -i $_ -c:a libvo_aacenc -b:a 64k $aacName");
}