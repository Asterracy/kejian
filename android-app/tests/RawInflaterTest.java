package cn.kejian.app;
import java.util.*;import java.util.zip.*;import java.io.*;import java.nio.file.*;
public final class RawInflaterTest {
 public static void main(String[] args)throws Exception{byte[] plain="课间 test data 12345".getBytes("UTF-8"),buf=new byte[200];Deflater d=new Deflater(6,true);d.setInput(plain);d.finish();int size=d.deflate(buf);d.end();String encoded=Base64.getEncoder().encodeToString(Arrays.copyOf(buf,size));int count=0;
 if(!Base64.getEncoder().encodeToString(plain).equals(RawInflater.decode(encoded,plain.length)))throw new AssertionError("raw decode");count++;
 if(RawInflater.decode(encoded,plain.length-1)!=null)throw new AssertionError("bound");count++;
 if(RawInflater.decode("invalid!",200)!=null)throw new AssertionError("bad base64");count++;
 if(RawInflater.decode(encoded,9*1024*1024)!=null)throw new AssertionError("oversized limit");count++;
 if(RawInflater.decode(Base64.getEncoder().encodeToString(new byte[]{1,2}),200)!=null)throw new AssertionError("truncated");count++;
 for(String path:args){byte[] zip=Files.readAllBytes(Paths.get(path));int offset=0;while(offset+30<zip.length&&read(zip,offset,4)==0x04034b50L){int method=(int)read(zip,offset+8,2),packed=(int)read(zip,offset+18,4),raw=(int)read(zip,offset+22,4),n=(int)read(zip,offset+26,2),extra=(int)read(zip,offset+28,2),start=offset+30+n+extra;if(method==8){String output=RawInflater.decode(Base64.getEncoder().encodeToString(Arrays.copyOfRange(zip,start,start+packed)),raw);if(output==null||Base64.getDecoder().decode(output).length!=raw)throw new AssertionError(path);count++;}offset=start+packed;}}
 System.out.println(count+" bounded native inflate checks passed");}
 static long read(byte[] b,int p,int n){long v=0;for(int k=0;k<n;k++)v|=(long)(b[p+k]&255)<<(8*k);return v;}
}
