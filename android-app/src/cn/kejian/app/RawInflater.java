package cn.kejian.app;
import java.io.ByteArrayOutputStream;import java.util.Base64;import java.util.zip.Inflater;
public final class RawInflater {
 private RawInflater(){}
 public static String decode(String encoded,int limit){if(encoded==null||encoded.length()>8*1024*1024||limit<0||limit>8*1024*1024)return null;Inflater inflater=new Inflater(true);try{byte[] input=Base64.getDecoder().decode(encoded);inflater.setInput(input);ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] chunk=new byte[16384];while(!inflater.finished()){int n=inflater.inflate(chunk);if(n==0)return null;if(out.size()+n>limit)return null;out.write(chunk,0,n);}return Base64.getEncoder().encodeToString(out.toByteArray());}catch(Exception e){return null;}finally{inflater.end();}}
}
