#!/usr/bin/env python 3
# -*- coding:utf-8 -*-
import os

import subprocess

videos = os.listdir('./videos')
chunks = [videos[x:x + 5] for x in range(0, len(videos), 5)]

# ffmpeg -i input1.mp4 -i input2.mp4 -i input3.mp4 -i input4.mp4 -i input5.mp4 -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0][2:v:0][2:a:0][3:v:0][3:a:0][4:v:0][4:a:0]concat=n=5:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" outputoutput.mkv

ffmpeg_command = "ffmpeg -i {} -i {} -i {} -i {} -i {} -filter_complex \"[0:v:0][0:a:0][1:v:0][1:a:0][2:v:0][2:a:0][3:v:0][3:a:0][4:v:0][4:a:0]concat=n=5:v=1:a=1[outv][outa]\" -map \"[outv]\" -map \"[outa]\" {}.mp4"

i = 0
for chunk in chunks:
    chunk.append("output" + str(i))
    ffmpeg_command_final = ffmpeg_command.format(*chunk)
    print(ffmpeg_command_final)
    p = subprocess.Popen(ffmpeg_command_final, cwd='./videos')
    p.wait()
    i += 1
